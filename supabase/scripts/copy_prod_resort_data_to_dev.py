#!/usr/bin/env python3
"""Copy production's resort data into the dev Supabase branch, so dev has realistic data to test with.

Copies (upserting by primary key; nothing on dev is deleted):
  resort_conditions            every resort: status, lifts/runs, snow totals
  stale_snowfall_values        every resort
  resort_snowfall_historical   the last --days days (default 30)

Never copies user data (profile, user_alerts), caic_data (dev's own cron fills it) or operational
tables. Production is only read (--read-only queries); writes go to the dev branch named in
supabase/config.toml [remotes.dev], in one transaction. Afterwards the copied rows are hashed on
both projects to confirm they match.

Notes:
  - Status changes go through dev's resort_status_changed trigger, so they appear in dev's
    resort_status_history as changes made at copy time.
  - The totals guard (keep_plausible_totals) only applies to service_role, so it doesn't
    interfere: queries here run as postgres.

Usage (from the repo root; needs `supabase login`):
  python3 supabase/scripts/copy_prod_resort_data_to_dev.py              # copy and verify
  python3 supabase/scripts/copy_prod_resort_data_to_dev.py --days 7
  python3 supabase/scripts/copy_prod_resort_data_to_dev.py --dry-run    # write the SQL, don't apply
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import secrets
import shlex
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
PROD_REF = "zfwpqcadelgvmvjmfuxi"

# table -> (primary key columns, row filter on prod, applied with --days)
TABLES = {
    "resort_conditions": (["mountain_id"], "true"),
    "stale_snowfall_values": (["mountain_id"], "true"),
    "resort_snowfall_historical": (["mountain_id", "date"], "date > current_date - {days}"),
}


def dev_ref() -> str:
    config = (ROOT / "supabase/config.toml").read_text(encoding="utf-8")
    m = re.search(r'^\[remotes\.dev\]\s*\nproject_id\s*=\s*"([a-z0-9]+)"', config, re.M)
    if not m:
        sys.exit("supabase/config.toml has no [remotes.dev] project_id")
    return m.group(1)


def query(cli: list[str], ref: str, sql: str = None, file: pathlib.Path = None, write: bool = False) -> list[dict]:
    """Runs SQL on a project and returns the last statement's rows."""
    cmd = cli + ["db", "query", "--linked", "--project-ref", ref]
    cmd += ["--yes"] if write else ["--read-only"]
    cmd += ["-f", str(file)] if file else [sql]
    proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    out = proc.stdout
    start = out.find("{")
    if proc.returncode != 0 or start < 0:
        sys.exit(f"query on {ref} failed (exit {proc.returncode}):\n{proc.stderr.strip()}\n{out.strip()}")
    result = json.loads(out[start:])
    if "error" in result:
        sys.exit(f"query on {ref} failed: {result['error']}")
    return result.get("rows", [])


def export(cli, table, where) -> tuple[str, list[str], int]:
    """Returns the table's matching prod rows as JSON text (kept verbatim, so numbers keep their
    exact form), its column names and the row count."""
    pk = TABLES[table][0]
    rows = query(cli, PROD_REF, f"""
        select coalesce(jsonb_agg(to_jsonb(x) order by {", ".join(pk)}), '[]'::jsonb)::text as data
        from public.{table} x where {where}""")
    data = rows[0]["data"]
    parsed = json.loads(data)
    if not parsed:
        return data, [], 0
    return data, list(parsed[0].keys()), len(parsed)


def upsert_sql(table: str, data: str, columns: list[str]) -> str:
    pk = TABLES[table][0]
    tag = "copy_" + secrets.token_hex(4)
    while f"${tag}$" in data:
        tag = "copy_" + secrets.token_hex(4)
    cols = ", ".join(f'"{c}"' for c in columns)
    sets = ", ".join(f'"{c}" = excluded."{c}"' for c in columns if c not in pk)
    return (
        f"insert into public.{table} ({cols})\n"
        f"select {cols} from jsonb_populate_recordset(null::public.{table}, ${tag}${data}${tag}$::jsonb)\n"
        f"on conflict ({', '.join(pk)}) do update set {sets};"
    )


def fingerprint_sql(filters: dict) -> str:
    parts = []
    for table, (pk, _) in TABLES.items():
        order = ", ".join(pk)
        parts.append(
            f"(select md5(coalesce(string_agg(to_jsonb(x)::text, ',' order by {order}), '')) "
            f"from public.{table} x where {filters[table]}) as {table}"
        )
    return "select " + ",\n  ".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--days", type=int, default=30, help="days of resort_snowfall_historical to copy (default 30)")
    ap.add_argument("--dry-run", action="store_true", help="write the SQL file but don't apply it")
    ap.add_argument("--cli", default="npx supabase", help='Supabase CLI command (default "npx supabase")')
    args = ap.parse_args()
    if args.days < 1:
        ap.error("--days must be at least 1")

    cli = shlex.split(args.cli)
    dev = dev_ref()
    if dev == PROD_REF:
        sys.exit("[remotes.dev] project_id is the production project; refusing to write to it")

    # Prod evaluates the window; the fingerprint reuses the exported date range, so both sides
    # compare the same rows even if the date rolls over in between.
    filters = {t: f.format(days=args.days) for t, (_, f) in TABLES.items()}
    statements = ["begin;"]
    for table in TABLES:
        data, columns, n = export(cli, table, filters[table])
        print(f"prod {table}: {n} rows")
        if n:
            statements.append(upsert_sql(table, data, columns))
            if table == "resort_snowfall_historical":
                dates = [r["date"] for r in json.loads(data)]
                filters[table] = f"date between '{min(dates)}' and '{max(dates)}'"
    statements.append("commit;")

    sql_file = pathlib.Path(tempfile.gettempdir()) / "copy_prod_resort_data_to_dev.sql"
    sql_file.write_text("\n\n".join(statements) + "\n", encoding="utf-8")
    if args.dry_run:
        print(f"dry run: SQL written to {sql_file} (target would be dev branch {dev})")
        return 0

    print(f"writing to dev branch {dev} ...")
    query(cli, dev, file=sql_file, write=True)

    check = fingerprint_sql(filters)
    prod_fp, dev_fp = query(cli, PROD_REF, check)[0], query(cli, dev, check)[0]
    ok = True
    for table in TABLES:
        same = prod_fp[table] == dev_fp[table]
        ok &= same
        print(f"  {table}: {'matches prod' if same else 'DIFFERS from prod'}")
    if not ok:
        print("dev changed between the copy and the check, or a write didn't apply; rerun to retry")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

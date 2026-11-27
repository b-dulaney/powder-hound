"""Validate every scraper config against supabase/storage/scraping-config.schema.json.

Also checks what JSON Schema can't: no two configs share an id, and cam keys are unique within
a resort. Exits non-zero with one line per problem.

Usage: python .github/scripts/validate_scraping_configs.py
"""

import collections
import json
import os
import pathlib
import sys

from jsonschema import Draft7Validator, FormatChecker

ROOT = pathlib.Path(__file__).resolve().parents[2]
SCHEMA = ROOT / "supabase/storage/scraping-config.schema.json"
CONFIG_DIR = ROOT / "supabase/storage/scraping-config"


def main() -> int:
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    Draft7Validator.check_schema(schema)
    validator = Draft7Validator(schema, format_checker=FormatChecker())

    problems = []
    ids = collections.defaultdict(list)
    files = sorted(CONFIG_DIR.glob("*.json"))
    for path in files:
        name = path.relative_to(ROOT)
        try:
            config = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as err:
            problems.append(f"{name}: invalid JSON: {err}")
            continue

        for err in sorted(validator.iter_errors(config), key=lambda e: list(e.absolute_path)):
            where = "/".join(str(p) for p in err.absolute_path) or "(root)"
            problems.append(f"{name}: {where}: {err.message}")

        if isinstance(config.get("id"), int):
            ids[config["id"]].append(path.name)
        keys = collections.Counter(c.get("key") for c in config.get("cams") or [] if isinstance(c, dict))
        problems += [f"{name}: cams: duplicate key {k!r}" for k, n in keys.items() if n > 1]

    problems += [f"id {i} is used by {', '.join(names)}" for i, names in ids.items() if len(names) > 1]

    annotate = "GITHUB_ACTIONS" in os.environ
    for line in problems:
        print(f"::error::{line}" if annotate else line)
    print(f"{len(files)} configs checked, {len(problems)} problem(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())

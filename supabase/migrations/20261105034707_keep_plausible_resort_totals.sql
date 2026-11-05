-- powder-hound-go now writes resort_conditions.total_lifts / total_runs from the totals resort
-- pages show ("12 of 147"), so totals follow lifts and runs added or removed between seasons.
-- A selector that grabs the wrong number could write a wild total, so a change from the
-- scrapers (role service_role) to under half or over double the current total is ignored,
-- keeping the old value; the monitor reports that reading as a broken scraper. Changes made
-- by hand (dashboard or SQL editor, role postgres) are always applied.

create or replace function private.keep_plausible_resort_totals()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if current_user = 'service_role' then
    if old.total_lifts > 0 and new.total_lifts is distinct from old.total_lifts
       and (new.total_lifts is null or new.total_lifts * 2 < old.total_lifts or new.total_lifts > old.total_lifts * 2) then
      raise warning 'resort_conditions %: ignoring total_lifts % (was %)', old.mountain_id, new.total_lifts, old.total_lifts;
      new.total_lifts := old.total_lifts;
    end if;
    if old.total_runs > 0 and new.total_runs is distinct from old.total_runs
       and (new.total_runs is null or new.total_runs * 2 < old.total_runs or new.total_runs > old.total_runs * 2) then
      raise warning 'resort_conditions %: ignoring total_runs % (was %)', old.mountain_id, new.total_runs, old.total_runs;
      new.total_runs := old.total_runs;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function private.keep_plausible_resort_totals() from public, anon, authenticated;

create trigger keep_plausible_totals
  before update of total_lifts, total_runs on public.resort_conditions
  for each row execute function private.keep_plausible_resort_totals();

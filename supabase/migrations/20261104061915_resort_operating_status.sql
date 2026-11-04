-- Resort open/closed status, replacing the hand-maintained `closing_date`.
--
-- `status` is set automatically by the powder-hound-go status checker (lift data, or a
-- Claude-read status page approved through a GitHub issue), or by hand. A manual status
-- (`status_source = 'manual'`) is never overwritten automatically; set the source back to
-- 'auto' to release it. Every change is recorded in `resort_status_history`.
--
-- `closing_date` is kept (unused) so the currently deployed app keeps working during
-- rollout; drop it in a later migration.

create type public.resort_operating_status as enum ('open', 'closed', 'unknown');

alter table public.resort_conditions
  add column status public.resort_operating_status not null default 'unknown',
  add column status_source text not null default 'auto'
    constraint resort_conditions_status_source_check check (status_source in ('auto', 'approved', 'manual')),
  add column status_evidence text,
  add column status_changed_at timestamptz,
  add column expected_open_date date,
  add column expected_close_date date;

comment on column public.resort_conditions.status is
  'Operating status. Written via public.set_resort_status(); closing_date is deprecated.';
comment on column public.resort_conditions.status_source is
  'auto = status checker, approved = checker proposal approved on GitHub, manual = set by hand (blocks auto updates).';

create table public.resort_status_history (
  id bigint generated always as identity primary key,
  mountain_id smallint not null references public.resort_conditions (mountain_id) on delete cascade,
  old_status public.resort_operating_status,
  new_status public.resort_operating_status not null,
  source text not null,
  evidence text,
  changed_at timestamptz not null default now()
);

create index resort_status_history_mountain_changed_idx
  on public.resort_status_history (mountain_id, changed_at desc);

-- Internal audit log: service role only (RLS on, no policies; explicit grants).
alter table public.resort_status_history enable row level security;
revoke all on table public.resort_status_history from anon, authenticated;
grant select, insert on table public.resort_status_history to service_role;

-- Record every status change, whoever makes it (RPC, SQL editor, or a future writer).
create function private.record_resort_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.resort_status_history (mountain_id, old_status, new_status, source, evidence)
  values (
    new.mountain_id,
    case when tg_op = 'UPDATE' then old.status end,
    new.status,
    new.status_source,
    new.status_evidence
  );
  return new;
end;
$$;

revoke all on function private.record_resort_status_change() from public, anon, authenticated;

create trigger resort_status_changed
  after update of status on public.resort_conditions
  for each row
  when (old.status is distinct from new.status)
  execute function private.record_resort_status_change();

-- Single write path for status. Returns true if the row changed; false when an automatic
-- update is skipped because the status was set by hand, or nothing differs.
create function public.set_resort_status(
  p_mountain_id smallint,
  p_status public.resort_operating_status,
  p_source text,
  p_evidence text default null,
  p_expected_open_date date default null,
  p_expected_close_date date default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  changed boolean;
begin
  if p_source not in ('auto', 'approved', 'manual') then
    raise exception 'invalid status source: %', p_source;
  end if;

  update public.resort_conditions rc
  set status = p_status,
      status_source = p_source,
      status_evidence = coalesce(p_evidence, rc.status_evidence),
      status_changed_at = case when rc.status is distinct from p_status then now() else rc.status_changed_at end,
      expected_open_date = coalesce(p_expected_open_date, rc.expected_open_date),
      expected_close_date = coalesce(p_expected_close_date, rc.expected_close_date)
  where rc.mountain_id = p_mountain_id
    -- Automatic writers never override a status set by hand.
    and (p_source = 'manual' or rc.status_source <> 'manual')
    and (
      rc.status is distinct from p_status
      or rc.status_source is distinct from p_source
      or (p_expected_open_date is not null and rc.expected_open_date is distinct from p_expected_open_date)
      or (p_expected_close_date is not null and rc.expected_close_date is distinct from p_expected_close_date)
    );

  get diagnostics changed = row_count;
  return changed;
end;
$$;

revoke all on function public.set_resort_status(smallint, public.resort_operating_status, text, text, date, date)
  from public, anon, authenticated;
grant execute on function public.set_resort_status(smallint, public.resort_operating_status, text, text, date, date)
  to service_role;

-- Backfill from the old signals. The trigger fires for every resort whose status changes from
-- the 'unknown' default, so the audit log starts with one backfill row per such resort.
update public.resort_conditions
set status = case
      when lifts_open > 0 then 'open'::public.resort_operating_status
      when closing_date is not null
        and closing_date < (now() at time zone 'America/Denver')::date then 'closed'::public.resort_operating_status
      else 'unknown'::public.resort_operating_status
    end,
    status_source = 'auto',
    status_evidence = 'Backfilled from lifts_open / closing_date',
    status_changed_at = now();

-- Readers: `closed` now comes from status. 'unknown' is treated as not closed, matching the
-- old behaviour for resorts without a closing date.
create or replace function public.is_resort_closed(resort_id integer)
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select rc.status = 'closed' from public.resort_conditions rc where rc.mountain_id = resort_id),
    false
  );
$$;

create or replace view public.alert_thresholds as
 select mountains.mountain_id,
    mountains.display_name,
    (resort_conditions.snow_past_24h)::smallint as snow_past_24h,
    resort_conditions.updated_at,
    (public.get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::smallint as snow_next_24h,
    (resort_conditions.snow_past_48h)::smallint as snow_past_48h
   from (public.mountains
     join public.resort_conditions on ((mountains.mountain_id = resort_conditions.mountain_id)))
  where resort_conditions.status <> 'closed'
union
 select mountains.mountain_id,
    mountains.display_name,
    (backcountry_overview.snow_past_24h)::smallint as snow_past_24h,
    public.get_most_recent_timestamp(mountains.mountain_id) as updated_at,
    (public.get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::smallint as snow_next_24h,
    (backcountry_overview.snow_past_48h)::smallint as snow_past_48h
   from (public.mountains
     join public.backcountry_overview on ((mountains.mountain_id = backcountry_overview.mountain_id)));

-- New columns are appended (CREATE OR REPLACE VIEW can only add columns at the end).
create or replace view public.resort_overview as
 select mountains.mountain_id,
    mountains.display_name,
    mountains.state,
    mountains.region,
    mountains.slug,
    resort_conditions.closing_date,
    coalesce((resort_conditions.base_depth)::integer, '-1'::integer) as base_depth,
    resort_conditions.runs_open,
    resort_conditions.total_runs,
    resort_conditions.total_lifts,
    resort_conditions.lifts_open,
    coalesce(resort_conditions.snow_past_24h, ('-1'::integer)::numeric) as snow_past_24h,
    coalesce(resort_conditions.snow_past_48h, (0)::numeric) as snow_past_48h,
    public.get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) as snow_next_24h,
    public.get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) as snow_next_72h,
    (resort_conditions.status = 'closed') as closed,
    resort_conditions.status,
    resort_conditions.expected_open_date,
    resort_conditions.expected_close_date
   from public.mountains,
    public.resort_conditions
  where (resort_conditions.mountain_id = mountains.mountain_id);

create or replace view public.resort_detail as
 select mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.state,
    mountains.region,
    mountains.location_type,
    resort_conditions.closing_date,
    resort_conditions.base_depth,
    resort_conditions.snow_past_24h,
    resort_conditions.snow_past_48h,
    resort_conditions.snow_past_week,
    resort_conditions.snow_total,
    resort_conditions.snow_type,
    resort_conditions.lifts_open,
    resort_conditions.total_lifts,
    resort_conditions.runs_open,
    resort_conditions.total_runs,
    resort_conditions.updated_at,
    resort_conditions.snow_stake_url,
    resort_conditions.trails_url,
    resort_conditions.lifts_url,
    public.get_daily_weather_conditions(mountains.mountain_id) as daily_weather_conditions,
    public.get_hourly_weather_data(mountains.mountain_id) as hourly_forecast,
    public.get_next_24h_hourly_snowfall(mountains.mountain_id) as next_24h_hourly_snowfall,
    public.get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) as snow_next_24h,
    public.get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) as snow_next_72h,
    public.get_current_temperature_for_mountain((mountains.mountain_id)::integer) as current_temp,
    public.get_current_weather_desc(mountains.mountain_id) as current_weather,
    public.get_temperature_range(mountains.mountain_id) as temperature_range,
    public.get_previous_snowfall_total(mountains.mountain_id) as previous_snowfall_totals,
    public.get_upcoming_snowfall_total(mountains.mountain_id) as upcoming_snowfall_totals,
    (resort_conditions.status = 'closed') as closed,
    resort_conditions.status,
    resort_conditions.expected_open_date,
    resort_conditions.expected_close_date
   from public.mountains,
    public.resort_conditions
  where ((mountains.location_type = 'resort'::text) and (resort_conditions.mountain_id = mountains.mountain_id));

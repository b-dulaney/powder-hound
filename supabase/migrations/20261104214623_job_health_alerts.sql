-- Job health alerts. Every 15 minutes pg_cron checks that powder-hound-go's jobs are running and
-- emails the operator (through Resend) when one stops, again every 24h while it stays down, and
-- once when it recovers.
--
--   resort-scrape          a successful resort scrape in scraping_status within 2h, while any
--                          resort isn't closed (quiet all summer)
--   avalanche-scrape       a successful avalanche scrape within 2h
--   daily jobs             a heartbeat (record_job_run) within 25h, and the latest run didn't fail:
--                          overnight-alert-email, forecast-alert-email, scraper-monitor
--
-- Needs two Vault secrets, set by hand in the SQL editor (the check does nothing without them,
-- so the dev branch and local stack stay quiet):
--   select vault.create_secret('<resend api key>', 'resend_api_key');
--   select vault.create_secret('<your email>', 'ops_alert_email');

-- ---------------------------------------------------------------------------------------------
-- Heartbeats from powder-hound-go
-- ---------------------------------------------------------------------------------------------
create table public.job_heartbeats (
  job text primary key,
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error text,
  -- Alert when the last success is older than this; null means the job isn't checked.
  max_age interval
);

comment on table public.job_heartbeats is
  'Last outcome of each scheduled powder-hound-go job, written via record_job_run (service_role only).';

alter table public.job_heartbeats enable row level security;
revoke all on public.job_heartbeats from anon, authenticated;
grant select, insert, update, delete on public.job_heartbeats to service_role;

-- Seeded as just succeeded, so nothing alerts before the jobs' first runs after deploy.
insert into public.job_heartbeats (job, last_success_at, max_age) values
  ('overnight-alert-email', now(), interval '25 hours'),
  ('forecast-alert-email', now(), interval '25 hours'),
  ('scraper-monitor', now(), interval '25 hours')
on conflict (job) do nothing;

-- Records one run: p_error null for success, the error message for a failure.
create or replace function public.record_job_run(p_job text, p_error text default null)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.job_heartbeats as h (job, last_success_at, last_error_at, last_error)
  values (
    p_job,
    case when p_error is null then now() end,
    case when p_error is not null then now() end,
    p_error
  )
  on conflict (job) do update set
    last_success_at = coalesce(excluded.last_success_at, h.last_success_at),
    last_error_at = coalesce(excluded.last_error_at, h.last_error_at),
    last_error = coalesce(excluded.last_error, h.last_error);
$$;

revoke all on function public.record_job_run(text, text) from public, anon, authenticated;
grant execute on function public.record_job_run(text, text) to service_role;

-- The resort and avalanche checks read the newest successful scrape every 15 minutes.
create index if not exists scraping_status_time_idx on public.scraping_status (time);

-- ---------------------------------------------------------------------------------------------
-- The check
-- ---------------------------------------------------------------------------------------------
-- One row per check that is currently failing, with when the operator was last emailed.
create table private.job_alert_state (
  check_name text primary key,
  failing_since timestamptz not null default now(),
  notified_at timestamptz not null default now(),
  detail text
);

-- Every check with its current result; failing rows carry a human-readable detail.
create or replace function private.job_health()
returns table (check_name text, failing boolean, detail text)
language sql
stable
security invoker
set search_path = ''
as $$
  with scrapes as (
    select
      max(time) filter (where display_name not like 'avalanche-%') as resort_last,
      max(time) filter (where display_name like 'avalanche-%') as avalanche_last
    from public.scraping_status
    where success and time > now() - interval '7 days'
  ),
  resorts_running as (
    select exists (select 1 from public.resort_conditions where status <> 'closed') as any_not_closed
  )
  select
    'resort-scrape',
    r.any_not_closed and (s.resort_last is null or s.resort_last < now() - interval '2 hours'),
    'No successful resort scrape since ' || coalesce(to_char(s.resort_last at time zone 'America/Denver', 'Mon DD HH24:MI MT'), 'over a week ago')
  from scrapes s, resorts_running r
  union all
  select
    'avalanche-scrape',
    s.avalanche_last is null or s.avalanche_last < now() - interval '2 hours',
    'No successful avalanche scrape since ' || coalesce(to_char(s.avalanche_last at time zone 'America/Denver', 'Mon DD HH24:MI MT'), 'over a week ago')
  from scrapes s
  union all
  select
    h.job,
    h.last_success_at is null
      or h.last_success_at < now() - h.max_age
      or coalesce(h.last_error_at > h.last_success_at, false),
    case
      when h.last_error_at > coalesce(h.last_success_at, '-infinity')
        then 'Last run failed at ' || to_char(h.last_error_at at time zone 'America/Denver', 'Mon DD HH24:MI MT') || ': ' || left(h.last_error, 500)
      else 'No successful run since ' || coalesce(to_char(h.last_success_at at time zone 'America/Denver', 'Mon DD HH24:MI MT'), 'ever')
    end
  from public.job_heartbeats h
  where h.max_age is not null;
$$;

create or replace function private.send_ops_email(p_subject text, p_text text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  api_key text;
  recipient text;
begin
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key';
  select decrypted_secret into recipient from vault.decrypted_secrets where name = 'ops_alert_email';
  if api_key is null or recipient is null then
    return;
  end if;
  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || api_key),
    body := jsonb_build_object(
      'from', 'PowderHound Ops <alerts@powderhound.io>',
      'to', jsonb_build_array(recipient),
      'subject', p_subject,
      'text', p_text
    ),
    timeout_milliseconds := 10000
  );
end;
$$;

-- Emails on a new failure, every 24h while it continues, and on recovery. Does nothing (and
-- changes no state) until the Vault secrets are set.
create or replace function private.check_job_health()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  c record;
  state private.job_alert_state;
  alerting boolean;
begin
  if not exists (select 1 from vault.decrypted_secrets where name in ('resend_api_key', 'ops_alert_email') having count(*) = 2) then
    return;
  end if;

  for c in select * from private.job_health() loop
    select * into state from private.job_alert_state where check_name = c.check_name;
    alerting := found;

    if c.failing and not alerting then
      insert into private.job_alert_state (check_name, detail) values (c.check_name, c.detail);
      perform private.send_ops_email('PowderHound: ' || c.check_name || ' is down', c.detail);
    elsif c.failing and state.notified_at < now() - interval '24 hours' then
      update private.job_alert_state set notified_at = now(), detail = c.detail where check_name = c.check_name;
      perform private.send_ops_email(
        'PowderHound: ' || c.check_name || ' is still down',
        c.detail || E'\nFailing since ' || to_char(state.failing_since at time zone 'America/Denver', 'Mon DD HH24:MI MT') || '.'
      );
    elsif not c.failing and alerting then
      delete from private.job_alert_state where check_name = c.check_name;
      perform private.send_ops_email(
        'PowderHound: ' || c.check_name || ' recovered',
        'Down since ' || to_char(state.failing_since at time zone 'America/Denver', 'Mon DD HH24:MI MT') || E'.\nLast problem: ' || coalesce(state.detail, '')
      );
    end if;
  end loop;
end;
$$;

revoke all on function private.job_health() from public, anon, authenticated;
revoke all on function private.send_ops_email(text, text) from public, anon, authenticated;
revoke all on function private.check_job_health() from public, anon, authenticated;
revoke all on private.job_alert_state from public, anon, authenticated;

select cron.schedule('job-health-check', '*/15 * * * *', 'select private.check_job_health()');

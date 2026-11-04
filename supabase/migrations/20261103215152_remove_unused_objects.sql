-- Remove unused database objects, including every function that embedded credentials
-- (service_role JWTs, an OpenWeatherMap key). Usage was audited on 2026-11-03 against the
-- SvelteKit app, powder-hound-go (scraping + alert emails), edge functions, views, and pg_cron.

-- ---------------------------------------------------------------------------------------------
-- Dead functions with hardcoded credentials. None are scheduled or called anywhere.
--   check_user_alerts            references user_alerts columns that no longer exist
--   process_avalanche_forecast*  posted to /api/avalanche-forecast-cron (removed in e929f82);
--                                avalanche scraping now lives in powder-hound-go
--   process_resort_web_elements* resort scraping trigger; replaced by powder-hound-go
--   send_post_request            manual test helper
--   get_daily_weather            OpenWeatherMap One Call 2.5 (retired API)
--   get_all_weather              references an undefined record; cannot execute
--   send_*_alert_emails          alert emails are sent by powder-hound-go, which calls the
--                                group_*_alert_data functions directly. These were also callable
--                                by anon via RPC and would email every subscriber.
-- ---------------------------------------------------------------------------------------------
drop function if exists public.check_user_alerts();
drop function if exists public.process_avalanche_forecast();
drop function if exists public.process_avalanche_forecast_v2();
drop function if exists public.process_resort_web_elements();
drop function if exists public.process_resort_web_elements_am();
drop function if exists public.send_post_request(text);
drop function if exists public.get_all_weather();
drop function if exists public.get_daily_weather(real, real);
drop function if exists public.send_forecast_alert_emails();
drop function if exists public.send_overnight_alert_emails();

-- Unreferenced helpers.
drop function if exists public.get_season_snowfall_for_mountain(integer);
drop function if exists public.get_worst_scraping_job_overall();

-- Unused table (PWA push notification experiment; empty).
drop table if exists public.user_devices;

-- Not dropped: public.debug_logs (empty, unused) is owned by supabase_read_only_user on
-- production, so the postgres role cannot drop it. Remove it via the dashboard/support.

-- ---------------------------------------------------------------------------------------------
-- Interim: CAIC weather fetch (pg_cron -> pg_net -> caic-data-cron edge function).
-- The production job had a service_role JWT inlined in cron.job. It now reads the target URL and
-- key from Vault so the leaked key can be rotated without breaking it.
-- TODO: remove this section, the edge function, and private.invoke_edge_function once the CAIC
-- fetch moves to powder-hound-go.
--
-- Required Vault secrets per environment (local values are created by seed.sql):
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<service role / secret key>', 'service_role_key');
-- ---------------------------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.invoke_edge_function(function_name text, body jsonb default '{}'::jsonb)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  base_url text;
  api_key text;
begin
  select decrypted_secret into base_url from vault.decrypted_secrets where name = 'project_url';
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'service_role_key';

  if base_url is null or api_key is null then
    raise exception 'Vault secrets "project_url" and "service_role_key" must be set to invoke edge functions';
  end if;

  return net.http_post(
    url := rtrim(base_url, '/') || '/functions/v1/' || function_name,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || api_key
    ),
    body := coalesce(body, '{}'::jsonb),
    -- caic-data-cron fetches all mountains before responding; the 5s default reports false timeouts.
    timeout_milliseconds := 60000
  );
end;
$$;

revoke all on function private.invoke_edge_function(text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- pg_cron jobs. cron.schedule upserts by job name, so this matches existing production jobs.
-- ---------------------------------------------------------------------------------------------
select cron.schedule(
  'caic-forecast-cronjob',
  '5 * * * *',
  $$
  select private.invoke_edge_function(
    'caic-data-cron',
    (select jsonb_agg(jsonb_build_object('mountain_id', mountain_id, 'caic_code', caic_code)) from public.mountains)
  );
  $$
);

select cron.schedule('update_resort_snowfall_historical', '0 13 * * *', 'SELECT public.update_resort_snowfall_historical()');
select cron.schedule('update_stale_snowfall_values', '0 14 * * *', 'SELECT public.update_stale_snowfall_values()');

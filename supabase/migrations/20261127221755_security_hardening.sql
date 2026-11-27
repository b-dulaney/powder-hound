-- Security hardening from the 2026-11-27 audit of production.
--
-- 1. Views run with the caller's permissions (security_invoker), so RLS applies through them.
-- 2. anon/authenticated get only the privileges the app uses: SELECT on public data, and on
--    user_alerts/profile what their owners need. Supabase's default grants gave them every
--    privilege (INSERT/UPDATE/DELETE/TRUNCATE...) on every table and view; RLS was the only
--    thing stopping writes, and TRUNCATE isn't subject to RLS at all.
-- 3. Users can no longer change profile.email (the address snow alerts are sent to) or set
--    user_alerts.email to someone else's address. Both now follow the account's auth email.
-- 4. Functions only the service role or pg_cron call aren't executable by anon/authenticated;
--    every function in public gets a fixed search_path.
-- 5. New objects in public are no longer exposed to anon/authenticated by default; migrations
--    grant what each one needs explicitly (as resort_cams does).
--
-- service_role and postgres (pg_cron) privileges are unchanged.

-- 1. Views --------------------------------------------------------------------------------------

alter view public.alert_thresholds set (security_invoker = true);
alter view public.backcountry_detail set (security_invoker = true);
alter view public.backcountry_overview set (security_invoker = true);
alter view public.mountain_snowfall_forecast set (security_invoker = true);
alter view public.mountain_snowfall_historical set (security_invoker = true);
alter view public.resort_detail set (security_invoker = true);
alter view public.resort_overview set (security_invoker = true);
alter view public.web_scraper_overview set (security_invoker = true);

-- backcountry_overview reads avalanche_forecasts directly. It had RLS and no policies, which only
-- worked because the view ran as its owner. The forecasts are public CAIC data.
create policy "Avalanche forecasts are public" on public.avalanche_forecasts
  for select to anon, authenticated using (true);

-- 2. Table and view privileges ------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;

-- Public data: what the views read directly, plus what the app and status page query.
grant select on
  public.mountains,
  public.resort_conditions,
  public.caic_data,
  public.avalanche_forecasts,
  public.scraping_status,
  public.resort_cams,
  public.resort_cam_images,
  public.alert_thresholds,
  public.backcountry_detail,
  public.backcountry_overview,
  public.mountain_snowfall_forecast,
  public.mountain_snowfall_historical,
  public.resort_detail,
  public.resort_overview,
  public.web_scraper_overview
to anon, authenticated;

-- A user's own alerts and profile (RLS limits both to their rows). Profiles are created by the
-- auth trigger and deleted by cascade from auth.users, so users only ever read them.
grant select, insert, update, delete on public.user_alerts to authenticated;
grant select on public.profile to authenticated;

drop policy "Enable all operations for users based on their user_id" on public.profile;
create policy "Users can read their own profile" on public.profile
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy "Enable operations for users based on user_id" on public.user_alerts;
create policy "Users manage their own alerts" on public.user_alerts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 3. Alert email addresses ----------------------------------------------------------------------

-- user_alerts.email always matches the owner's profile email, whatever the client sends. Runs
-- as the caller: RLS lets a user read their own profile, and the alert's user_id is theirs.
create function public.set_user_alert_email()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.email := (select p.email from public.profile p where p.user_id = new.user_id);
  return new;
end;
$$;
revoke execute on function public.set_user_alert_email() from public, anon, authenticated;

create trigger set_user_alert_email
  before insert or update of email, user_id on public.user_alerts
  for each row execute function public.set_user_alert_email();

-- Bring any existing rows in line.
update public.user_alerts u set email = p.email
from public.profile p
where p.user_id = u.user_id and u.email is distinct from p.email;

-- Keep profile.email (and so the alert addresses) in step when a user changes their email.
-- Security definer because auth's own role runs the update on auth.users.
create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profile set email = new.email where user_id = new.id;
  -- Fires set_user_alert_email, which copies the new profile email.
  update public.user_alerts set email = new.email where user_id = new.id;
  return new;
end;
$$;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- 4. Functions ----------------------------------------------------------------------------------

-- Trigger function (security definer): never callable directly.
alter function public.handle_new_user() set search_path = '';
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Called by pg_cron (as postgres) or by powder-hound-go with the service key only.
revoke execute on function
  public.update_resort_snowfall_historical(),
  public.update_stale_snowfall_values(),
  public.get_24h_alert_data(),
  public.get_overnight_alert_data(),
  public.group_24h_forecast_alert_data(),
  public.group_overnight_snowfall_alert_data()
from public, anon, authenticated;
grant execute on function
  public.update_resort_snowfall_historical(),
  public.update_stale_snowfall_values(),
  public.get_24h_alert_data(),
  public.get_overnight_alert_data(),
  public.group_24h_forecast_alert_data(),
  public.group_overnight_snowfall_alert_data()
to service_role;

-- Fixed search_path for every function in public that doesn't set one. Their bodies use
-- unqualified names in public, so behaviour doesn't change.
do $$
declare
  f regprocedure;
begin
  for f in
    select p.oid::regprocedure
    from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.prokind = 'f'
      and p.proconfig is null
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
  loop
    execute format('alter function %s set search_path = public', f);
  end loop;
end;
$$;

-- 5. Defaults for new objects -------------------------------------------------------------------

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on functions from anon, authenticated;

-- Not here (postgres doesn't own them; do these in the dashboard):
-- - public.debug_logs has RLS off, but it's owned by supabase_read_only_user and has no grants to
--   anon/authenticated, so the Data API can't reach it. Drop it (it's empty and unused).
-- - storage.objects policy "Anyone can upload an avatar." is for an avatars bucket that doesn't
--   exist. Delete it under Storage → Policies.

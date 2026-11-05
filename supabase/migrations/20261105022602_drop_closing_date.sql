-- Drop resort_conditions.closing_date. Resort status (status / expected_close_date, set by the
-- scraper monitor and the /approve flow) replaced it, and nothing reads it anymore: the Go
-- scraper queue reads status since powder-hound-go 857c50a, and the app never selected it.
--
-- A view can't lose a column through CREATE OR REPLACE, so both views that expose it are
-- dropped and recreated (same definitions minus closing_date, same grants) in this
-- migration's transaction.

drop view public.resort_overview;
drop view public.resort_detail;

alter table public.resort_conditions drop column closing_date;

create view public.resort_overview as
 select mountains.mountain_id,
    mountains.display_name,
    mountains.state,
    mountains.region,
    mountains.slug,
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

create view public.resort_detail as
 select mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.state,
    mountains.region,
    mountains.location_type,
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

grant all on public.resort_overview to anon, authenticated, service_role;
grant all on public.resort_detail to anon, authenticated, service_role;

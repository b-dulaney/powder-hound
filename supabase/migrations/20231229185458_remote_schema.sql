revoke delete on table "public"."daily_forecasts" from "anon";

revoke insert on table "public"."daily_forecasts" from "anon";

revoke references on table "public"."daily_forecasts" from "anon";

revoke select on table "public"."daily_forecasts" from "anon";

revoke trigger on table "public"."daily_forecasts" from "anon";

revoke truncate on table "public"."daily_forecasts" from "anon";

revoke update on table "public"."daily_forecasts" from "anon";

revoke delete on table "public"."daily_forecasts" from "authenticated";

revoke insert on table "public"."daily_forecasts" from "authenticated";

revoke references on table "public"."daily_forecasts" from "authenticated";

revoke select on table "public"."daily_forecasts" from "authenticated";

revoke trigger on table "public"."daily_forecasts" from "authenticated";

revoke truncate on table "public"."daily_forecasts" from "authenticated";

revoke update on table "public"."daily_forecasts" from "authenticated";

revoke delete on table "public"."daily_forecasts" from "service_role";

revoke insert on table "public"."daily_forecasts" from "service_role";

revoke references on table "public"."daily_forecasts" from "service_role";

revoke select on table "public"."daily_forecasts" from "service_role";

revoke trigger on table "public"."daily_forecasts" from "service_role";

revoke truncate on table "public"."daily_forecasts" from "service_role";

revoke update on table "public"."daily_forecasts" from "service_role";

revoke delete on table "public"."result" from "anon";

revoke insert on table "public"."result" from "anon";

revoke references on table "public"."result" from "anon";

revoke select on table "public"."result" from "anon";

revoke trigger on table "public"."result" from "anon";

revoke truncate on table "public"."result" from "anon";

revoke update on table "public"."result" from "anon";

revoke delete on table "public"."result" from "authenticated";

revoke insert on table "public"."result" from "authenticated";

revoke references on table "public"."result" from "authenticated";

revoke select on table "public"."result" from "authenticated";

revoke trigger on table "public"."result" from "authenticated";

revoke truncate on table "public"."result" from "authenticated";

revoke update on table "public"."result" from "authenticated";

revoke delete on table "public"."result" from "service_role";

revoke insert on table "public"."result" from "service_role";

revoke references on table "public"."result" from "service_role";

revoke select on table "public"."result" from "service_role";

revoke trigger on table "public"."result" from "service_role";

revoke truncate on table "public"."result" from "service_role";

revoke update on table "public"."result" from "service_role";

revoke delete on table "public"."snow_accumulation" from "anon";

revoke insert on table "public"."snow_accumulation" from "anon";

revoke references on table "public"."snow_accumulation" from "anon";

revoke select on table "public"."snow_accumulation" from "anon";

revoke trigger on table "public"."snow_accumulation" from "anon";

revoke truncate on table "public"."snow_accumulation" from "anon";

revoke update on table "public"."snow_accumulation" from "anon";

revoke delete on table "public"."snow_accumulation" from "authenticated";

revoke insert on table "public"."snow_accumulation" from "authenticated";

revoke references on table "public"."snow_accumulation" from "authenticated";

revoke select on table "public"."snow_accumulation" from "authenticated";

revoke trigger on table "public"."snow_accumulation" from "authenticated";

revoke truncate on table "public"."snow_accumulation" from "authenticated";

revoke update on table "public"."snow_accumulation" from "authenticated";

revoke delete on table "public"."snow_accumulation" from "service_role";

revoke insert on table "public"."snow_accumulation" from "service_role";

revoke references on table "public"."snow_accumulation" from "service_role";

revoke select on table "public"."snow_accumulation" from "service_role";

revoke trigger on table "public"."snow_accumulation" from "service_role";

revoke truncate on table "public"."snow_accumulation" from "service_role";

revoke update on table "public"."snow_accumulation" from "service_role";

revoke delete on table "public"."weekly_forecasts" from "anon";

revoke insert on table "public"."weekly_forecasts" from "anon";

revoke references on table "public"."weekly_forecasts" from "anon";

revoke select on table "public"."weekly_forecasts" from "anon";

revoke trigger on table "public"."weekly_forecasts" from "anon";

revoke truncate on table "public"."weekly_forecasts" from "anon";

revoke update on table "public"."weekly_forecasts" from "anon";

revoke delete on table "public"."weekly_forecasts" from "authenticated";

revoke insert on table "public"."weekly_forecasts" from "authenticated";

revoke references on table "public"."weekly_forecasts" from "authenticated";

revoke select on table "public"."weekly_forecasts" from "authenticated";

revoke trigger on table "public"."weekly_forecasts" from "authenticated";

revoke truncate on table "public"."weekly_forecasts" from "authenticated";

revoke update on table "public"."weekly_forecasts" from "authenticated";

revoke delete on table "public"."weekly_forecasts" from "service_role";

revoke insert on table "public"."weekly_forecasts" from "service_role";

revoke references on table "public"."weekly_forecasts" from "service_role";

revoke select on table "public"."weekly_forecasts" from "service_role";

revoke trigger on table "public"."weekly_forecasts" from "service_role";

revoke truncate on table "public"."weekly_forecasts" from "service_role";

revoke update on table "public"."weekly_forecasts" from "service_role";

alter table "public"."daily_forecasts" drop constraint "daily_forecasts_mountain_id_fkey";

alter table "public"."snow_accumulation" drop constraint "snow_accumulation_mountain_id_fkey";

alter table "public"."weekly_forecasts" drop constraint "weekly_forecasts_mountain_id_fkey";

alter table "public"."daily_forecasts" drop constraint "daily_forecasts_pkey";

alter table "public"."snow_accumulation" drop constraint "snow_accumulation_pkey";

alter table "public"."weekly_forecasts" drop constraint "weekly_forecasts_duplicate_pkey";

drop index if exists "public"."daily_forecasts_pkey";

drop index if exists "public"."snow_accumulation_pkey";

drop index if exists "public"."weekly_forecasts_duplicate_pkey";

drop table "public"."daily_forecasts";

drop table "public"."result";

drop table "public"."snow_accumulation";

drop table "public"."weekly_forecasts";

alter table "public"."caic_data" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > (now() at time zone 'MST') and datetime < (now() at time zone 'MST'+ interval '24 hours'))::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_72_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > (now() at time zone 'MST') and datetime < (now() at time zone 'MST' + interval '72 hours'))::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_daily_weather_conditions(mountain_id smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    result jsonb;
BEGIN
    WITH DailyConditions as (
      SELECT mode() WITHIN GROUP (ORDER BY weather_desc) AS daily_weather,
      caic_data.datetime::date as date
    FROM 
      caic_data
    WHERE
      caic_data.mountain_id = $1
      AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '1 day')::date
    GROUP BY
      caic_data.datetime::date
    ORDER BY
      caic_data.datetime::date
    )
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', date,
        'daily_weather', LOWER(daily_weather)
      ) 
    ) INTO result
    FROM DailyConditions;
    RETURN result;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_hourly_weather_data(id smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE 
  result jsonb;
BEGIN
  WITH HourlyWeatherData AS (
    SELECT 
      datetime,
      weather_desc,
      snowfall_in,
      wind_deg_speed,
      wind_gust,
      temp
    FROM 
      caic_data
    WHERE
      mountain_id = $1
      AND datetime >= current_timestamp at time zone 'MST' - interval '6 hours'
      AND datetime <= current_timestamp at time zone 'MST' + interval '16 hours'
    GROUP by
      datetime,
      weather_desc,
      snowfall_in,
      wind_deg_speed,
      wind_gust,
      temp
    ORDER by
      datetime
  )
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'datetime', datetime,
        'weather_desc', LOWER(weather_desc),
        'snowfall', snowfall_in,
        'wind_deg_speed', wind_deg_speed,
        'wind_gust', wind_gust,
        'temp', temp
      )
    ) INTO result
  FROM
    HourlyWeatherData;
  RETURN result;
END;
 $function$
;

CREATE OR REPLACE FUNCTION public.get_past_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((
    select sum(snowfall_in)
    from caic_data
    where mountain_id = id
    and datetime >= (now() at time zone 'MST' - interval '24 hours') and datetime <= (now() at time zone 'MST')
  )::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_past_7_days_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date >= (now() at time zone 'MST' - interval '7 days')::date and datetime <= (now() at time zone 'MST'))::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_previous_snowfall_total(mountain_id smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    result jsonb;
BEGIN
    WITH SnowfallTotalCTE AS (
        SELECT
            caic_data.datetime::date AS date,
            sum(snowfall_in) AS snowfall_total
        FROM
            caic_data
        WHERE
            caic_data.mountain_id = $1
            AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '7 days')::date
            AND caic_data.datetime <= (now() at time zone 'MST')
        GROUP BY
            caic_data.datetime::date
        ORDER BY
            caic_data.datetime::date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', TO_CHAR(date, 'mm/dd'),
                'snowfall_total', snowfall_total
            )
        ) INTO result
    FROM
        SnowfallTotalCTE;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_temperature_range(id smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    result jsonb;
BEGIN
    WITH TemperatureMinMax AS (
        SELECT
            caic_data.datetime::date AS date,
            max(caic_data.temp) AS high_temp,
            min(caic_data.temp) AS low_temp
        FROM
            caic_data
        WHERE
            mountain_id = $1
            AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '1 day')::date
        GROUP BY
            caic_data.datetime::date
        ORDER by
            caic_data.datetime::date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', date,
                'high_temp', high_temp,
                'low_temp', low_temp
            )
        ) INTO result
    FROM
        TemperatureMinMax;

    RETURN result;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."caic_data"
as permissive
for select
to public
using (true);




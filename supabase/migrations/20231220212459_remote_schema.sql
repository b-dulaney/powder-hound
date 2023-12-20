drop view if exists "public"."mountain_detail";

drop view if exists "public"."mountain_overview";

set check_function_bodies = off;

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
      caic_data.datetime::date >= current_date - interval '2 days'
      AND caic_data.datetime::date <= current_date + interval '3 days'
    GROUP BY
      caic_data.datetime::date
    ORDER BY
      caic_data.datetime::date
    )
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', TO_CHAR(date, 'mm/dd'),
        'daily_weather', LOWER(daily_weather)
      ) 
    ) INTO result
    FROM DailyConditions;
    RETURN result;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '24 hours')::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_72_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '72 hours')::numeric, 1);
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
      wind_deg_speed,
      wind_gust,
      temp
    FROM 
      caic_data
    WHERE
      mountain_id = 2
      AND datetime >= current_timestamp at time zone 'MST' - interval '6 hours'
      AND datetime::date <= current_timestamp::date at time zone 'MST' + interval '16 hours'
    GROUP by
      datetime,
      weather_desc,
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
        'weather_desc', weather_desc,
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
    and datetime >= current_timestamp at time zone 'MST' - interval '24 hours' and datetime <= current_timestamp at time zone 'MST'
  )::numeric, 1);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_past_7_days_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date >= current_timestamp::date at time zone 'MST' - interval '7 days' and datetime::date <= current_timestamp::date at time zone 'MST')::numeric, 1);
end;
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
            AND caic_data.datetime::date >= current_date - interval '5 days'
            AND caic_data.datetime::date <= current_date + interval '3 days'
        GROUP BY
            caic_data.datetime::date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', TO_CHAR(date, 'mm/dd'),
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

create or replace view "public"."mountain_detail" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.region,
    mountains.location_type,
    mountains.lat,
    mountains.lon,
    mountains.model_elevation AS elevation,
    get_daily_weather_conditions(mountains.mountain_id) AS daily_weather_conditions,
    get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer) AS past7daysnowfall,
    get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS next72hoursnowfall,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS current_temperature,
    get_current_weather_desc(mountains.mountain_id) AS current_weather,
    get_temperature_range(mountains.mountain_id) AS temperature_range,
    get_previous_snowfall_total(mountains.mountain_id) AS previous_snowfall_totals,
    get_upcoming_snowfall_total(mountains.mountain_id) AS upcoming_snowfall_totals
   FROM mountains;


create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    mountains.region,
    mountains.location_type,
    mountains.slug,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS currenttemp,
    get_current_weather_desc(mountains.mountain_id) AS weather_desc,
    get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer) AS past7daysnowfall,
    get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS past24hoursnowfall,
    get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS next24hoursnowfall,
    get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS next72hoursnowfall
   FROM mountains;


create or replace view "public"."hourly_forecast_view" as  SELECT mountains.mountain_id,
    mountains.display_name,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;




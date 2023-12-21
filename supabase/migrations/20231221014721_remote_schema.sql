drop view if exists "public"."hourly_forecast";

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
      caic_data.datetime::date > current_date at time zone 'MST' - interval '2 days'
      AND caic_data.datetime::date <= current_date at time zone 'MST' + interval '3 days'
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
            mountain_id = 3
            AND caic_data.datetime::date > current_date at time zone 'MST' - interval '2 days'
            AND caic_data.datetime::date <= current_date at time zone 'MST' + interval '3 days'
        GROUP BY
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

create or replace view "public"."hourly_forecast" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;




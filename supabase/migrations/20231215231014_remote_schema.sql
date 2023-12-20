set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_hourly_weather_data(mountain_id smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE 
  result jsonb;
BEGIN
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'datetime',
        datetime,
        'weather_desc',
        weather_desc,
        'wind_deg_speed',
        wind_deg_speed,
        'wind_gust',
        wind_gust,
        'temp',
        temp
      )
    ) INTO result
  FROM
    caic_data
  WHERE
    caic_data.mountain_id = $1
    AND caic_data.datetime >= now() - interval '12 hours'
    AND caic_data.datetime <= now() + interval '12 hours'
  GROUP BY
    caic_data.datetime
  ORDER by
    caic_data.datetime;
  RETURN result;
END;
 $function$
;

CREATE OR REPLACE FUNCTION public.get_snowfall_total(mountain_id smallint)
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
            AND caic_data.datetime::date >= current_date - interval '5 days'
            AND caic_data.datetime::date <= current_date + interval '3 days'
        GROUP BY
            date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', date,
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
            AND caic_data.datetime::date >= current_date - interval '5 days'
            AND caic_data.datetime::date <= current_date + interval '3 days'
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



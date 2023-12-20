drop view if exists "public"."mountain_detail";

drop function if exists "public"."get_snowfall_total"(mountain_id smallint);

set check_function_bodies = off;

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
            AND caic_data.datetime::date >= current_date - interval '7 days'
            AND caic_data.datetime <= current_timestamp at time zone 'MST'
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

CREATE OR REPLACE FUNCTION public.get_upcoming_snowfall_total(mountain_id smallint)
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
            AND caic_data.datetime <= current_timestamp + interval '72 hours'
            AND caic_data.datetime >= current_timestamp at time zone 'MST'
        GROUP BY
            date
        ORDER BY
            date
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

create or replace view "public"."mountain_detail" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.region,
    mountains.location_type,
    mountains.lat,
    mountains.lon,
    mountains.model_elevation AS elevation,
    get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer) AS past7daysnowfall,
    get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS next72hoursnowfall,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS current_temperature,
    get_current_weather_desc(mountains.mountain_id) AS current_weather,
    get_temperature_range(mountains.mountain_id) AS temperature_range,
    get_previous_snowfall_total(mountains.mountain_id) AS previous_snowfall_totals,
    get_upcoming_snowfall_total(mountains.mountain_id) AS upcoming_snowfall_totals,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;




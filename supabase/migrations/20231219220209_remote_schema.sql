drop view if exists "public"."mountain_detail";

drop view if exists "public"."mountain_overview";

drop function if exists "public"."get_past_5_days_snowfall_for_mountain"(id integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_past_7_days_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date > current_timestamp::date at time zone 'MST' - interval '7 days' and datetime::date < current_timestamp::date at time zone 'MST')::integer, 2);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_current_weather_desc(id smallint)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
  return (select LOWER(weather_desc) from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour');
end;
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
            AND caic_data.datetime::date >= current_date - interval '7 days'
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
    get_snowfall_total(mountains.mountain_id) AS snowfall_totals,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;


create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    mountains.region,
    mountains.location_type,
    mountains.slug,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS currenttemp,
    (get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past7daysnowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past24hoursnowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next24hoursnowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next72hoursnowfall
   FROM mountains;




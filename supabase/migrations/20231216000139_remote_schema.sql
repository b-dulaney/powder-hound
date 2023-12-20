drop view if exists "public"."mountain_detail";

drop function if exists "public"."get_hourly_weather_data"(mountain_id smallint);

create table "public"."result" (
    "jsonb_agg" jsonb
);


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_current_weather_desc(id smallint)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
  return (select weather_desc from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour');
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
      AND datetime >= current_timestamp at time zone 'MST' - interval '12 hours'
      AND datetime <= current_timestamp at time zone 'MST' + interval '12 hours'
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

create or replace view "public"."mountain_detail" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.region,
    mountains.location_type,
    mountains.lat,
    mountains.lon,
    mountains.model_elevation AS elevation,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS current_temperature,
    get_current_weather_desc(mountains.mountain_id) AS current_weather,
    get_temperature_range(mountains.mountain_id) AS temperature_range,
    get_snowfall_total(mountains.mountain_id) AS snowfall_totals,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;


grant delete on table "public"."result" to "anon";

grant insert on table "public"."result" to "anon";

grant references on table "public"."result" to "anon";

grant select on table "public"."result" to "anon";

grant trigger on table "public"."result" to "anon";

grant truncate on table "public"."result" to "anon";

grant update on table "public"."result" to "anon";

grant delete on table "public"."result" to "authenticated";

grant insert on table "public"."result" to "authenticated";

grant references on table "public"."result" to "authenticated";

grant select on table "public"."result" to "authenticated";

grant trigger on table "public"."result" to "authenticated";

grant truncate on table "public"."result" to "authenticated";

grant update on table "public"."result" to "authenticated";

grant delete on table "public"."result" to "service_role";

grant insert on table "public"."result" to "service_role";

grant references on table "public"."result" to "service_role";

grant select on table "public"."result" to "service_role";

grant trigger on table "public"."result" to "service_role";

grant truncate on table "public"."result" to "service_role";

grant update on table "public"."result" to "service_role";



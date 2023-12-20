drop view if exists "public"."mountain_overview";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return (select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '24 hours');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_72_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return (select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '72 hours');
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_past_7_days_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return (select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date > current_timestamp::date at time zone 'MST' - interval '7 days' and datetime < current_timestamp at time zone 'MST');
end;
$function$
;

create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    mountains.region,
    mountains.location_type,
    mountains.slug,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS currenttemp,
    get_current_weather_desc(mountains.mountain_id) AS weather_desc,
    (get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past7daysnowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past24hoursnowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next24hoursnowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next72hoursnowfall
   FROM mountains;




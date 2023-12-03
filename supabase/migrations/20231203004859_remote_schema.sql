drop view if exists "public"."mountain_snowfall";

drop view if exists "public"."mountain_overview";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_current_temperature_for_mountain(id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
begin
  return (select temp from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour');
end;
$function$
;

create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    mountains.region,
    mountains.location_type,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS currenttemp,
    (get_past_5_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past5daysnowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past24hoursnowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next24hoursnowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next72hoursnowfall
   FROM mountains;




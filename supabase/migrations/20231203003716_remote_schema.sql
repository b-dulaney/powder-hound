alter table "public"."mountains" add column "location_type" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_current_temperature_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  select temp from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour';
end;
$function$
;

create or replace view "public"."mountain_snowfall" as  SELECT mountains.display_name,
    (get_current_temperature_for_mountain((mountains.mountain_id)::integer))::integer AS currenttemp,
    (get_past_5_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past5daysnowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past24hoursnowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next24hoursnowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next72hoursnowfall
   FROM mountains;




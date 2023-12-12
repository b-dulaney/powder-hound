alter table "public"."caic_data" alter column "snowfall_in" set not null;

alter table "public"."caic_data" alter column "temp" set not null;

alter table "public"."caic_data" alter column "visbility_miles" set not null;

alter table "public"."caic_data" alter column "wind_deg_speed" set not null;

alter table "public"."caic_data" alter column "wind_gust" set not null;

alter table "public"."mountains" alter column "caic_code" set not null;

alter table "public"."mountains" alter column "location_type" set not null;

alter table "public"."mountains" alter column "model_elevation" set not null;

alter table "public"."mountains" alter column "region" set not null;

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



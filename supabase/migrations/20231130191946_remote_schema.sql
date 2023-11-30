CREATE INDEX idx_caic_mountain_id ON public.caic_data USING btree (mountain_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '24 hours')::integer, 2);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_72_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' and datetime < current_timestamp at time zone 'MST' + interval '72 hours')::integer, 2);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_past_24_hour_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' - interval '24 hours' and datetime < current_timestamp at time zone 'MST')::integer, 2);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_past_5_days_snowfall_for_mountain(id integer)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > current_timestamp at time zone 'MST' - interval '120 hours' and datetime < current_timestamp at time zone 'MST')::integer, 2);
end;
$function$
;

create or replace view "public"."mountain_snowfall" as  SELECT mountains.display_name,
    get_past_5_days_snowfall_for_mountain((mountains.mountain_id)::integer) AS get_past_5_days_snowfall_for_mountain,
    get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS get_past_24_hour_snowfall_for_mountain,
    get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS get_24_hour_snowfall_for_mountain,
    get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS get_72_hour_snowfall_for_mountain
   FROM mountains;




drop view if exists "public"."mountain_snowfall";

create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    (get_past_5_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past_5_days_snowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past_24_hours_snowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next_24_hours_snowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next_72_hours_snowfall
   FROM mountains;




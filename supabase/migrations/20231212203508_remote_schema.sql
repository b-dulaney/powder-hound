drop view if exists "public"."mountain_overview";

alter table "public"."mountains" add column "slug" text;

create or replace view "public"."mountain_overview" as  SELECT mountains.display_name,
    mountains.region,
    mountains.location_type,
    mountains.slug,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS currenttemp,
    (get_past_5_days_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past5daysnowfall,
    (get_past_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS past24hoursnowfall,
    (get_24_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next24hoursnowfall,
    (get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer))::integer AS next72hoursnowfall
   FROM mountains;




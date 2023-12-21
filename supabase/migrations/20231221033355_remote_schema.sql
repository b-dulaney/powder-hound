drop view if exists "public"."hourly_forecast";

drop view if exists "public"."mountain_detail";

create or replace view "public"."mountain_detail" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.region,
    mountains.location_type,
    mountains.lat,
    mountains.lon,
    mountains.model_elevation AS elevation,
    get_daily_weather_conditions(mountains.mountain_id) AS daily_weather_conditions,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_forecast,
    get_past_7_days_snowfall_for_mountain((mountains.mountain_id)::integer) AS past7daysnowfall,
    get_72_hour_snowfall_for_mountain((mountains.mountain_id)::integer) AS next72hoursnowfall,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS current_temperature,
    get_current_weather_desc(mountains.mountain_id) AS current_weather,
    get_temperature_range(mountains.mountain_id) AS temperature_range,
    get_previous_snowfall_total(mountains.mountain_id) AS previous_snowfall_totals,
    get_upcoming_snowfall_total(mountains.mountain_id) AS upcoming_snowfall_totals
   FROM mountains;




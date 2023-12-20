drop view if exists "public"."hourly_forecast_view";

create or replace view "public"."hourly_forecast" as  SELECT mountains.mountain_id,
    mountains.display_name,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;




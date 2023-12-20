create or replace view "public"."mountain_detail" as  SELECT mountains.mountain_id,
    mountains.display_name,
    mountains.slug,
    mountains.region,
    mountains.location_type,
    mountains.lat,
    mountains.lon,
    mountains.model_elevation AS elevation,
    get_current_temperature_for_mountain((mountains.mountain_id)::integer) AS current_temperature,
    get_temperature_range(mountains.mountain_id) AS temperature_range,
    get_snowfall_total(mountains.mountain_id) AS snowfall_totals,
    get_hourly_weather_data(mountains.mountain_id) AS hourly_weather_data
   FROM mountains;




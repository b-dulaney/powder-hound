-- Baseline: production schema (project zfwpqcadelgvmvjmfuxi) as of 2026-11-03, via `supabase db dump`.
-- Hardcoded credentials in function bodies were replaced with <redacted>; the functions that held them
-- are dropped or rewritten in the following migration (remove_unused_objects).
-- Already applied on production: mark with `supabase migration repair --status applied <version>`.



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."alert_type" AS ENUM (
    'forecast',
    'overnight'
);


ALTER TYPE "public"."alert_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_alerts"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    user_alert_record RECORD;
    alert_data JSONB;
    http_response TEXT;
BEGIN
    -- Iterate through each row in 'user_alerts' where 'alerts_paused' is FALSE
    FOR user_alert_record IN
        SELECT *
        FROM user_alerts
        WHERE NOT alerts_paused
    LOOP
        RAISE NOTICE 'User Alert Record: %', user_alert_record;
        alert_data := '{}'::JSONB;

        -- Check if any mountain in 'over_1_in' array exists in 'alert_thresholds' view
        IF EXISTS (
            SELECT 1
            FROM UNNEST(user_alert_record.over_1_in) AS mountain_id
            WHERE EXISTS (
                SELECT 1
                FROM alert_thresholds
                WHERE alert_thresholds.mountain_id = mountain_id
                AND alert_thresholds.over_1_in
            )
        ) THEN
            -- Add data to alert_data JSONB object
            alert_data := alert_data || jsonb_build_object(
                'alertThresholds',
                jsonb_agg(
                    jsonb_build_object(
                        'mountain_id', alert_thresholds.mountain_id,
                        'display_name', alert_thresholds.display_name,
                        'snowfall', alert_thresholds.snow_next_24h,
                        'url', alert_thresholds.url
                    )
                ),
                'email', user_alert_record.email
            );
        END IF;

        -- Check if any mountain in 'over_3_in' array exists in 'alert_thresholds' view
                IF EXISTS (
            SELECT 1
            FROM UNNEST(user_alert_record.over_3_in) AS mountain_id
            WHERE EXISTS (
                SELECT 1
                FROM alert_thresholds
                WHERE alert_thresholds.mountain_id = mountain_id
                AND alert_thresholds.over_3_in
            )
        ) THEN
            -- Add data to alert_data JSONB object
            alert_data := alert_data || jsonb_build_object(
                'alertThresholds',
                jsonb_agg(
                    jsonb_build_object(
                        'mountain_id', alert_thresholds.mountain_id,
                        'display_name', alert_thresholds.display_name,
                        'snowfall', alert_thresholds.snow_next_24h,
                        'url', alert_thresholds.url
                    )
                ),
                'email', user_alert_record.email
            );
        END IF;

        -- Check if any mountain in 'over_6_in' array exists in 'alert_thresholds' view
        IF EXISTS (
            SELECT 1
            FROM UNNEST(user_alert_record.over_6_in) AS mountain_id
            WHERE EXISTS (
                SELECT 1
                FROM alert_thresholds
                WHERE alert_thresholds.mountain_id = mountain_id
                AND alert_thresholds.over_6_in
            )
        ) THEN
            -- Add data to alert_data JSONB object
            alert_data := alert_data || jsonb_build_object(
                'alertThresholds',
                jsonb_agg(
                    jsonb_build_object(
                        'mountain_id', alert_thresholds.mountain_id,
                        'display_name', alert_thresholds.display_name,
                        'snow_next_24h', alert_thresholds.snow_next_24h,
                        'url', alert_thresholds.url
                    )
                ),
                'email', user_alert_record.email
            );
        END IF;

        -- Check if any mountain in 'over_12_in' array exists in 'alert_thresholds' view
        IF EXISTS (
            SELECT 1
            FROM UNNEST(user_alert_record.over_12_in) AS mountain_id
            WHERE EXISTS (
                SELECT 1
                FROM alert_thresholds
                WHERE alert_thresholds.mountain_id = mountain_id
                AND alert_thresholds.over_12_in
            )
        ) THEN
            -- Add data to alert_data JSONB object
            alert_data := alert_data || jsonb_build_object(
                'alertThresholds',
                jsonb_agg(
                    jsonb_build_object(
                        'mountain_id', alert_thresholds.mountain_id,
                        'display_name', alert_thresholds.display_name,
                        'snow_next_24h', alert_thresholds.snow_next_24h,
                        'url', alert_thresholds.url
                    )
                ),
                'email', user_alert_record.email
            );
        END IF;
        RAISE NOTICE 'Alert Data: %', alert_data;
        -- If alert_data is not empty, perform actions like sending an email
        IF alert_data IS NOT NULL AND jsonb_array_length(alert_data->'alertThresholds') > 0 THEN
            RAISE NOTICE 'Sending email for user %', user_alert_record.user_id;
            RAISE NOTICE 'Email Data: %', alert_data;
            
            http_response := net.http_post(
                url := 'https://zfwpqcadelgvmvjmfuxi.supabase.co/functions/v1/send-forecast-alert-email',
                headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
                body := alert_data
            );

            RAISE NOTICE 'HTTP Response for email send request: %', http_response;
        END IF;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."check_user_alerts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."count_errors_by_day"() RETURNS "json"[]
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON[];
    row_record RECORD;
BEGIN
    result := ARRAY[]::JSON[];

    FOR row_record IN
        SELECT (time AT TIME ZONE 'America/Denver')::DATE AS date, COUNT(*) AS error_count
        FROM scraping_status
        WHERE success = FALSE
        GROUP BY (time AT TIME ZONE 'America/Denver')::DATE
        ORDER BY (time AT TIME ZONE 'America/Denver')::DATE
    LOOP
        result := result || ARRAY[json_build_object('date', row_record.date, 'error_count', row_record.error_count)];
    END LOOP;

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."count_errors_by_day"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > now() and datetime < (now() + interval '24 hours'))::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_24h_alert_data"() RETURNS TABLE("user_id" "uuid", "email" "text", "mountain_id" smallint, "display_name" "text", "threshold_inches" smallint, "snow_next_24h" smallint, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.user_id,
        p.email,
        m.mountain_id,
        m.display_name,
        u.threshold_inches,
        a.snow_next_24h,
        a.updated_at
    FROM
        profile p
    JOIN
        user_alerts u ON p.user_id = u.user_id
    JOIN
        mountains m ON u.mountain_id = m.mountain_id
    JOIN
        alert_thresholds a ON m.mountain_id = a.mountain_id
    where
        a.snow_next_24h >= u.threshold_inches
        and a.updated_at >= current_timestamp - interval '8 hours';
END;
$$;


ALTER FUNCTION "public"."get_24h_alert_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > now() and datetime < (now() + interval '72 hours'))::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_weather"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$

declare mviews record;
begin
for mviews in 
  select mountain_id, lat, lon from mountains
  order by 1
loop
select get_daily_weather(mount.lat, mount.lon) as json_result;
return json_result;
end loop;
end;
$$;


ALTER FUNCTION "public"."get_all_weather"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
begin
  return (select temp from caic_data where mountain_id = id and datetime <= current_timestamp and datetime > current_timestamp - interval '1 hour');
end;
$$;


ALTER FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_weather_desc"("id" smallint) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
begin
  return (
    select 
    LOWER(weather_desc) as weather_desc
    from caic_data 
    where mountain_id = $1 
    and datetime <= now() 
    and datetime > (now() - interval '1 hour')
    );
end;
$_$;


ALTER FUNCTION "public"."get_current_weather_desc"("id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$begin
  RETURN(select content::json
  from http_get(concat('https://api.openweathermap.org/data/2.5/onecall?lat=', lat, '&lon=', lon, '&units=imperial&exclude=minutely,hourly&appid=<redacted>')));

  end;$$;


ALTER FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_daily_weather_conditions"("mountain_id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result jsonb;
BEGIN
    WITH DailyConditions as (
      SELECT mode() WITHIN GROUP (ORDER BY weather_desc) AS daily_weather,
      caic_data.datetime::date as date
    FROM 
      caic_data
    WHERE
      caic_data.mountain_id = $1
      AND caic_data.datetime::date >= (now() at time zone 'America/Denver' - interval '1 day')::date
    GROUP BY
      caic_data.datetime::date
    ORDER BY
      caic_data.datetime::date
    )
    SELECT jsonb_agg(
      jsonb_build_object(
        'date', date,
        'daily_weather', LOWER(daily_weather)
      ) 
    ) INTO result
    FROM DailyConditions;
    RETURN result;
  end;
$_$;


ALTER FUNCTION "public"."get_daily_weather_conditions"("mountain_id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_display_name_with_highest_failure_count"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
            'display_name', s.display_name,
            'total_failed_rows', total_failed_rows,
            'percentage_failed', percentage_failed
        )
    INTO result
    FROM (
        SELECT 
            s.display_name, 
            count(*) AS total_failed_rows, 
            ROUND((count(*) * 100.0 / (SELECT count(*) FROM scraping_status s WHERE s.display_name = s.display_name AND success = false)), 1) AS percentage_failed
        FROM 
            scraping_status s
        WHERE 
            success = false
        GROUP BY 
            s.display_name
        ORDER BY 
            total_failed_rows DESC
        LIMIT 1
    ) s;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_display_name_with_highest_failure_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_display_name_with_highest_failure_count_last_24h"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
            'display_name', s.display_name,
            'total_failed_rows', total_failed_rows,
            'percentage_failed', percentage_failed
        )
    INTO result
    FROM (
        SELECT 
            s.display_name, 
            count(*) AS total_failed_rows, 
            ROUND((count(*) * 100.0 / (SELECT count(*) FROM scraping_status s2 WHERE s2.display_name = s.display_name AND s2.time >= now() - interval '24 hours')), 1) AS percentage_failed
        FROM 
            scraping_status s
        WHERE 
            success = false AND s.time >= now() - interval '24 hours'
        GROUP BY 
            s.display_name
        ORDER BY 
            total_failed_rows DESC
        LIMIT 1
    ) s;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_display_name_with_highest_failure_count_last_24h"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_hourly_weather_data"("id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE 
  result jsonb;
BEGIN
  WITH HourlyWeatherData AS (
    SELECT 
      datetime,
      weather_desc,
      snowfall_in,
      wind_deg_speed,
      wind_gust,
      temp
    FROM 
      caic_data
    WHERE
      mountain_id = $1
      AND datetime > current_timestamp - interval '1 hour'
      AND datetime <= current_timestamp + interval '24 hours'
    GROUP by
      datetime,
      weather_desc,
      snowfall_in,
      wind_deg_speed,
      wind_gust,
      temp
    ORDER by
      datetime
  )
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'datetime', datetime,
        'weather_desc', LOWER(weather_desc),
        'snowfall', snowfall_in,
        'wind_deg_speed', wind_deg_speed,
        'wind_gust', wind_gust,
        'temp', temp
      )
    ) INTO result
  FROM
    HourlyWeatherData;
  RETURN result;
END;
 $_$;


ALTER FUNCTION "public"."get_hourly_weather_data"("id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_most_recent_timestamp"("mountain_id" smallint) RETURNS timestamp with time zone
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN (SELECT MAX(created_at) FROM caic_data WHERE caic_data.mountain_id = $1);
END;
$_$;


ALTER FUNCTION "public"."get_most_recent_timestamp"("mountain_id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_next_24h_hourly_snowfall"("id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE 
  result jsonb;
BEGIN
  WITH HourlyWeatherData AS (
    SELECT 
      datetime,
      weather_desc,
      snowfall_in
    FROM 
      caic_data
    WHERE
      mountain_id = $1
      AND datetime > current_timestamp - interval '1 hour'
      AND datetime <= current_timestamp + interval '24 hours'
    GROUP by
      datetime,
      weather_desc,
      snowfall_in
    ORDER by
      datetime
  )
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'datetime', datetime,
        'weather_desc', LOWER(weather_desc),
        'snowfall', snowfall_in
      )
    ) INTO result
  FROM
    HourlyWeatherData;
  RETURN result;
END;
 $_$;


ALTER FUNCTION "public"."get_next_24h_hourly_snowfall"("id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_overnight_alert_data"() RETURNS TABLE("user_id" "uuid", "email" "text", "mountain_id" smallint, "display_name" "text", "threshold_inches" smallint, "snow_past_24h" smallint, "updated_at" timestamp with time zone, "snow_past_48h" smallint, "stale_snow_past_24h" numeric, "stale_snow_past_48h" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.user_id,
        p.email,
        m.mountain_id,
        m.display_name,
        u.threshold_inches,
        a.snow_past_24h,
        a.updated_at,
        a.snow_past_48h,
        s.stale_snow_past_24h,
        s.stale_snow_past_48h
    FROM
        profile p
    JOIN
        user_alerts u ON p.user_id = u.user_id
    JOIN
        mountains m ON u.mountain_id = m.mountain_id
    JOIN
        alert_thresholds a ON m.mountain_id = a.mountain_id
    JOIN 
        stale_snowfall_values s ON a.mountain_id = s.mountain_id
    where
        a.snow_past_24h >= u.threshold_inches
        and a.updated_at >= current_timestamp - interval '8 hours'
        and a.snow_past_24h != s.stale_snow_past_24h
        and a.snow_past_48h != s.stale_snow_past_48h;
END;
$$;


ALTER FUNCTION "public"."get_overnight_alert_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((
    select sum(snowfall_in)
    from caic_data
    where mountain_id = id
    and datetime >= (now() - interval '24 hours') and datetime <= now()
  )::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_past_48_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((
    select sum(snowfall_in)
    from caic_data
    where mountain_id = id
    and datetime >= (now() - interval '48 hours') 
    and datetime <= now()
  )::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_past_48_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((
    select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date at time zone 'America/Denver' >= (now() at time zone 'America/Denver' - interval '7 days')::date and datetime <= now() at time zone 'America/Denver')::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result jsonb;
BEGIN
    WITH SnowfallTotalCTE AS (
        SELECT
            (caic_data.datetime at time zone 'America/Denver')::date AS date,
            sum(snowfall_in) AS snowfall_total
        FROM
            caic_data
        WHERE
            caic_data.mountain_id = $1
            AND caic_data.datetime at time zone 'America/Denver' >= (now() at time zone 'America/Denver' - interval '7 days')
            AND caic_data.datetime at time zone 'America/Denver' <= (now() at time zone 'America/Denver')
        GROUP BY
            date
        ORDER BY
            date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', date::text,
                'snowfall_total', snowfall_total
            )
        ) INTO result
    FROM
        SnowfallTotalCTE;

    RETURN result;
END;
$_$;


ALTER FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recent_scraping_status"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(json_build_object(
            'display_name', r.display_name,
            'status', r.status
        ))
    INTO result
    FROM (
        WITH ranked_records AS (
            SELECT 
                s.display_name,
                json_agg(json_build_object(
                  'id', s.id,
                  'success', s.success,
                  'error', s.error,
                  'time', s.time
                ) ORDER BY s.time ASC) AS status
            FROM (
                SELECT 
                    s.id,
                    s.display_name,
                    s.success,
                    s.error,
                    s.time,
                    ROW_NUMBER() OVER (PARTITION BY s.display_name ORDER BY s.time DESC) AS row_num
                FROM 
                    scraping_status s
            ) s
            WHERE 
                s.row_num <= 20
            GROUP BY
                s.display_name
        )
        SELECT 
            r.display_name,
            r.status
        FROM 
            ranked_records r
    ) AS r;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_recent_scraping_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_season_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((
    select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date at time zone 'America/Denver' >= (now() at time zone 'America/Denver' - interval '7 months')::date and datetime <= now() at time zone 'America/Denver')::numeric, 1);
end;
$$;


ALTER FUNCTION "public"."get_season_snowfall_for_mountain"("id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_success_percentage"() RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    total_rows numeric;
    success_rows numeric;
    success_percentage numeric;
BEGIN
    SELECT COUNT(*)
    INTO total_rows
    FROM public.scraping_status;
    
    SELECT COUNT(*)
    INTO success_rows
    FROM public.scraping_status
    WHERE success = true;
    
    IF total_rows > 0 THEN
        success_percentage := ROUND((success_rows / total_rows) * 100, 1);
    ELSE
        success_percentage := 0;
    END IF;
    
    RETURN success_percentage;
END;
$$;


ALTER FUNCTION "public"."get_success_percentage"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_success_percentage_24h"() RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    total_rows numeric;
    success_rows numeric;
    success_percentage numeric;
BEGIN
    SELECT COUNT(*)
    INTO total_rows
    FROM public.scraping_status
    WHERE time >= now() - interval '24 hours';
    
    SELECT COUNT(*)
    INTO success_rows
    FROM public.scraping_status
    WHERE success = true
    and time >= now() - interval '24 hours';
    
    IF total_rows > 0 THEN
        success_percentage := ROUND((success_rows / total_rows) * 100, 1);
    ELSE
        success_percentage := 0;
    END IF;
    
    RETURN success_percentage;
END;
$$;


ALTER FUNCTION "public"."get_success_percentage_24h"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_temperature_range"("id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result jsonb;
BEGIN
    WITH TemperatureMinMax AS (
        SELECT
            (caic_data.datetime at time zone 'America/Denver')::date AS date,
            max(caic_data.temp) AS high_temp,
            min(caic_data.temp) AS low_temp,
            sum(snowfall_in) as snowfall
        FROM
            caic_data
        WHERE
            mountain_id = $1
            AND caic_data.datetime::date at time zone 'America/Denver' >= (now() at time zone 'America/Denver' - interval '1 day')::date
        GROUP BY
            date
        ORDER by
            date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', CASE WHEN date = (now() at time zone 'America/Denver')::date THEN 'Today' ELSE date::text END,
                'high_temp', high_temp,
                'low_temp', low_temp,
                'snowfall', snowfall
            )
        ) INTO result
    FROM
        TemperatureMinMax;

    RETURN result;
END;
$_$;


ALTER FUNCTION "public"."get_temperature_range"("id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result jsonb;
BEGIN
    WITH SnowfallTotalCTE AS (
        SELECT
            (caic_data.datetime at time zone 'America/Denver')::date AS date,
            sum(snowfall_in) AS snowfall_total
        FROM
            caic_data
        WHERE
            caic_data.mountain_id = $1
            AND caic_data.datetime at time zone 'America/Denver' <= (now() at time zone 'America/Denver' + interval '72 hours') 
            AND caic_data.datetime at time zone 'America/Denver' >= (now() at time zone 'America/Denver')
        GROUP BY
            date
        ORDER BY
            date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', date::text,
                'snowfall_total', snowfall_total
            )
        ) INTO result
    FROM
        SnowfallTotalCTE;

    RETURN result;
END;
$_$;


ALTER FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_worst_scraping_job_overall"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    failed_display_name text;
BEGIN
    SELECT display_name INTO failed_display_name
    FROM scraping_status
    WHERE success = false
    GROUP BY display_name
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    RETURN failed_display_name;
END;
$$;


ALTER FUNCTION "public"."get_worst_scraping_job_overall"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."group_24h_forecast_alert_data"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result_data jsonb;
BEGIN
    -- Call the function and group the results by user_id
    SELECT 
        json_agg(json_build_object(
            'email', email,
            'alerts', alerts
    )) INTO result_data
    FROM (
        SELECT
            email,
            json_agg(
                json_build_object(
                    'display_name', display_name,
                    'snow_next_24h', snow_next_24h
                )
            ) AS alerts
        FROM get_24h_alert_data()
        GROUP BY email
    ) AS subquery;

    -- Return the array of JSON objects
    RETURN result_data;
END;
$$;


ALTER FUNCTION "public"."group_24h_forecast_alert_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."group_overnight_snowfall_alert_data"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result_data jsonb;
BEGIN
    -- Call the function and group the results by user_id
    SELECT 
        json_agg(json_build_object(
            'email', email,
            'alerts', alerts
    )) INTO result_data
    FROM (
        SELECT
            email,
            json_agg(
                json_build_object(
                    'display_name', display_name,
                    'snow_past_24h', snow_past_24h
                )
            ) AS alerts
        FROM get_overnight_alert_data()
        GROUP BY email
    ) AS subquery;

    -- Return the array of JSON objects
    RETURN result_data;
END;
$$;


ALTER FUNCTION "public"."group_overnight_snowfall_alert_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profile (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_resort_closed"("resort_id" integer) RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    close_date DATE;
    today_date DATE;
BEGIN
    -- Get the closing_date for the provided resort_id
    SELECT closing_date INTO close_date
    FROM resort_conditions
    WHERE mountain_id = resort_id;

    -- Convert today's date to America/Denver timezone
    today_date := (current_timestamp AT TIME ZONE 'America/Denver')::date;

    -- Check if closing_date is before today's date
    IF close_date < today_date THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;


ALTER FUNCTION "public"."is_resort_closed"("resort_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_avalanche_forecast"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  mountain JSONB;
  http_response TEXT;
BEGIN
  -- Iterate over each element in resort_web_elements
  FOR mountain IN SELECT row_to_json(t) AS json_data
                     FROM (
                       SELECT mountain_id, lat, lon 
                       FROM public.mountains
                       WHERE location_type = 'backcountry'
                     ) t
  LOOP
    -- Make the HTTP request for each element
    RAISE NOTICE 'Processing element: %', mountain;

    http_response := net.http_post(
      url := 'https://powderhound.io/api/avalanche-forecast-cron',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
      body := mountain
    );

    -- Log the HTTP response
    RAISE NOTICE 'HTTP Response for element: %', http_response;

  END LOOP;
END;
$$;


ALTER FUNCTION "public"."process_avalanche_forecast"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_avalanche_forecast_v2"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  mountain RECORD;
  http_response TEXT;
  start_ts TIMESTAMP := clock_timestamp();
  body_text TEXT;
  truncated_body TEXT;
  resp_preview TEXT;
  token_text TEXT := '<REDACTED_TOKEN>'; -- replace with secure retrieval if available
BEGIN
  -- Log function start
  INSERT INTO public.debug_logs(level, message, meta)
  VALUES (
    'info',
    'process_avalanche_forecast started',
    jsonb_build_object('started_at', start_ts)
  );

  FOR mountain IN
    SELECT mountain_id, lat, lon
    FROM public.mountains
    WHERE location_type = 'backcountry'
  LOOP
    -- Prepare body as JSON text
    body_text := row_to_json(mountain)::text;

    -- Truncate for storage/logging
    IF length(body_text) > 1000 THEN
      truncated_body := substr(body_text, 1, 1000) || '... (truncated)';
    ELSE
      truncated_body := body_text;
    END IF;

    -- Insert pre-request log
    INSERT INTO public.debug_logs(level, message, meta)
    VALUES (
      'info',
      'processing mountain - about to send request',
      jsonb_build_object(
        'mountain_id', mountain.mountain_id,
        'payload_preview', truncated_body,
        'timestamp', clock_timestamp()
      )
    );

    -- Perform outbound HTTP POST. Do not log the token value.
    http_response := net.http_post(
      url := 'https://powderhound.io/api/avalanche-forecast-cron',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
      body := row_to_json(mountain)
    );

    -- Prepare response preview (truncate)
    IF http_response IS NULL THEN
      resp_preview := NULL;
    ELSIF length(http_response) > 2000 THEN
      resp_preview := substr(http_response, 1, 2000) || '... (truncated)';
    ELSE
      resp_preview := http_response;
    END IF;

    -- Insert post-request log
    INSERT INTO public.debug_logs(level, message, meta)
    VALUES (
      'info',
      'received response for mountain',
      jsonb_build_object(
        'mountain_id', mountain.mountain_id,
        'response_preview', resp_preview,
        'response_is_null', http_response IS NULL,
        'timestamp', clock_timestamp()
      )
    );

    -- Also raise notice for immediate visibility in postgres logs
    RAISE NOTICE '[process_avalanche_forecast] mountain_id=% response_preview=%', mountain.mountain_id, COALESCE(resp_preview, 'NULL');
  END LOOP;

  -- Log completion with duration
  INSERT INTO public.debug_logs(level, message, meta)
  VALUES (
    'info',
    'process_avalanche_forecast completed',
    jsonb_build_object(
      'completed_at', clock_timestamp(),
      'duration', clock_timestamp() - start_ts
    )
  );

  RAISE NOTICE '[process_avalanche_forecast] completed at % (duration: %)', clock_timestamp(), clock_timestamp() - start_ts;
END;
$$;


-- Prod has this owned by service_role (set manually); not reproducible via migrations and the
-- function is dropped in remove_unused_objects.
-- ALTER FUNCTION "public"."process_avalanche_forecast_v2"() OWNER TO "service_role";


CREATE OR REPLACE FUNCTION "public"."process_resort_web_elements"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  element_data JSONB;
  http_response TEXT;
BEGIN
  FOR element_data IN SELECT json_build_object('mountainName', display_name) AS json_data
                     FROM public.mountains
  LOOP
    RAISE NOTICE 'Processing element: %', element_data;

    http_response := net.http_post(
      url := 'http://64.23.239.68:80',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
      body := element_data::jsonb
    );

    RAISE NOTICE 'HTTP Response for element: %', http_response;

  END LOOP;
END;
$$;


ALTER FUNCTION "public"."process_resort_web_elements"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_resort_web_elements_am"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  element_data JSONB;
  http_response TEXT;
BEGIN
  FOR element_data IN SELECT row_to_json(t) AS json_data
                     FROM (
                       SELECT * 
                       FROM public.resort_web_elements
                     ) t
  LOOP
    RAISE NOTICE 'Processing element: %', element_data;

    http_response := net.http_post(
      url := 'https://powderhound.io/api/web-scraper-cron',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
      body := element_data::jsonb
    );

    RAISE NOTICE 'HTTP Response for element: %', http_response;

  END LOOP;
END;
$$;


ALTER FUNCTION "public"."process_resort_web_elements_am"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_forecast_alert_emails"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    request_body jsonb;
    http_response TEXT;
BEGIN
    SELECT group_24h_forecast_alert_data() INTO request_body;

     http_response := net.http_post(
                url := 'https://zfwpqcadelgvmvjmfuxi.supabase.co/functions/v1/send-forecast-alert-email',
                headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
                body := request_body
            );
    RAISE NOTICE 'API response: %', http_response;

END;
$$;


ALTER FUNCTION "public"."send_forecast_alert_emails"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_overnight_alert_emails"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    request_body jsonb;
    http_response TEXT;
BEGIN
    -- Call the function to get and group alert data
    SELECT group_overnight_snowfall_alert_data() INTO request_body;

    -- Construct HTTP request
     http_response := net.http_post(
                url := 'https://zfwpqcadelgvmvjmfuxi.supabase.co/functions/v1/send-overnight-alert-email',
                headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
                body := request_body
            );
    RAISE NOTICE 'API response: %', http_response;

END;
$$;


ALTER FUNCTION "public"."send_overnight_alert_emails"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_post_request"("mountain_name_param" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    url text := 'http://64.23.239.68:80';
    request_body json;
    http_response TEXT;
BEGIN
    -- Construct the JSON payload
    request_body := json_build_object('mountainName', mountain_name_param);

    -- Send the POST request
   http_response := net.http_post(
      url := 'http://64.23.239.68:80',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer <redacted>"}',
      body := request_body::jsonb
    );
    RAISE NOTICE 'TEST HTTP response: %', http_response;
    
END;
$$;


ALTER FUNCTION "public"."send_post_request"("mountain_name_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_resort_snowfall_historical"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO public.resort_snowfall_historical (mountain_id, resort_snow_24h, caic_snow_24h, date)
    SELECT rc.mountain_id, rc.snow_past_24h, get_past_24_hour_snowfall_for_mountain(rc.mountain_id::integer), now() AT TIME ZONE 'America/Denver' - INTERVAL '24 hours'
    FROM public.resort_conditions rc;
END;
$$;


ALTER FUNCTION "public"."update_resort_snowfall_historical"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_stale_snowfall_values"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE stale_snowfall_values
    SET stale_snow_past_24h = resort_conditions.snow_past_24h,
        stale_snow_past_48h = resort_conditions.snow_past_48h
    FROM resort_conditions
    WHERE stale_snowfall_values.mountain_id = resort_conditions.mountain_id;
END;
$$;


ALTER FUNCTION "public"."update_stale_snowfall_values"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."avalanche_forecasts" (
    "mountain_id" smallint NOT NULL,
    "avalanche_summary" "text",
    "issue_date" "text",
    "overall_danger_level" smallint,
    "danger_levels" "jsonb"[],
    "forecast_url" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."avalanche_forecasts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mountains" (
    "mountain_id" smallint NOT NULL,
    "display_name" "text" NOT NULL,
    "lat" real NOT NULL,
    "lon" real NOT NULL,
    "region" character varying NOT NULL,
    "caic_code" character varying NOT NULL,
    "model_elevation" smallint NOT NULL,
    "location_type" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "pass" "text",
    "state" "text"
);


ALTER TABLE "public"."mountains" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."backcountry_overview" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    "mountains"."location_type",
    "mountains"."state",
    "mountains"."region",
    "mountains"."slug",
    "public"."get_past_7_days_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_past_7d",
    "public"."get_past_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_past_24h",
    "public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_24h",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_72h",
    "avalanche_forecasts"."overall_danger_level",
    "public"."get_past_48_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_past_48h"
   FROM "public"."mountains",
    "public"."avalanche_forecasts"
  WHERE ("avalanche_forecasts"."mountain_id" = "mountains"."mountain_id");


ALTER TABLE "public"."backcountry_overview" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resort_conditions" (
    "mountain_id" smallint NOT NULL,
    "base_depth" smallint,
    "total_lifts" smallint,
    "lifts_open" smallint,
    "total_runs" smallint,
    "runs_open" smallint,
    "snow_stake_url" "text",
    "display_name" "text",
    "snow_past_24h" numeric,
    "snow_past_48h" numeric,
    "snow_past_week" numeric,
    "snow_total" numeric,
    "snow_type" "text",
    "updated_at" timestamp with time zone,
    "lifts_url" "text",
    "trails_url" "text",
    "snow_overnight" numeric,
    "closing_date" "date"
);


ALTER TABLE "public"."resort_conditions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."alert_thresholds" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    ("resort_conditions"."snow_past_24h")::smallint AS "snow_past_24h",
    "resort_conditions"."updated_at",
    ("public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer))::smallint AS "snow_next_24h",
    ("resort_conditions"."snow_past_48h")::smallint AS "snow_past_48h"
   FROM ("public"."mountains"
     JOIN "public"."resort_conditions" ON (("mountains"."mountain_id" = "resort_conditions"."mountain_id")))
  WHERE (("resort_conditions"."closing_date" IS NULL) OR ("resort_conditions"."closing_date" > (("now"() AT TIME ZONE 'America/Denver'::"text"))::"date"))
UNION
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    ("backcountry_overview"."snow_past_24h")::smallint AS "snow_past_24h",
    "public"."get_most_recent_timestamp"("mountains"."mountain_id") AS "updated_at",
    ("public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer))::smallint AS "snow_next_24h",
    ("backcountry_overview"."snow_past_48h")::smallint AS "snow_past_48h"
   FROM ("public"."mountains"
     JOIN "public"."backcountry_overview" ON (("mountains"."mountain_id" = "backcountry_overview"."mountain_id")));


ALTER TABLE "public"."alert_thresholds" OWNER TO "postgres";


ALTER TABLE "public"."avalanche_forecasts" ALTER COLUMN "mountain_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."avalanche_forecasts_mountain_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."backcountry_detail" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    "mountains"."state",
    "mountains"."region",
    "mountains"."location_type",
    "mountains"."slug",
    "public"."get_next_24h_hourly_snowfall"("mountains"."mountain_id") AS "next_24h_hourly_snowfall",
    "public"."get_daily_weather_conditions"("mountains"."mountain_id") AS "daily_weather_conditions",
    "public"."get_hourly_weather_data"("mountains"."mountain_id") AS "hourly_forecast",
    "public"."get_past_7_days_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_past_7d",
    "public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_24h",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_72h",
    "public"."get_current_temperature_for_mountain"(("mountains"."mountain_id")::integer) AS "current_temp",
    "public"."get_current_weather_desc"("mountains"."mountain_id") AS "current_weather",
    "public"."get_temperature_range"("mountains"."mountain_id") AS "temperature_range",
    "public"."get_previous_snowfall_total"("mountains"."mountain_id") AS "previous_snowfall_totals",
    "public"."get_upcoming_snowfall_total"("mountains"."mountain_id") AS "upcoming_snowfall_totals",
    "avalanche_forecasts"."avalanche_summary",
    "avalanche_forecasts"."danger_levels",
    "avalanche_forecasts"."forecast_url",
    "avalanche_forecasts"."issue_date",
    "avalanche_forecasts"."overall_danger_level"
   FROM "public"."mountains",
    "public"."avalanche_forecasts"
  WHERE ("avalanche_forecasts"."mountain_id" = "mountains"."mountain_id");


ALTER TABLE "public"."backcountry_detail" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."caic_data" (
    "mountain_id" smallint NOT NULL,
    "datetime" timestamp with time zone NOT NULL,
    "temp" smallint NOT NULL,
    "wind_deg_speed" character varying NOT NULL,
    "wind_gust" smallint NOT NULL,
    "weather_desc" character varying,
    "snowfall_in" real NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "dew_point" smallint,
    "relative_humidity" smallint,
    "cei" smallint,
    "visbility_miles" real NOT NULL,
    "ncpcp_in" real,
    "cnpcp_in" real,
    "wetbulb_temp" smallint
);


ALTER TABLE "public"."caic_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."debug_logs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "level" "text" NOT NULL,
    "message" "text" NOT NULL,
    "meta" "jsonb"
);


-- Prod: owned by supabase_read_only_user (created by accident); postgres cannot reproduce this.
-- ALTER TABLE "public"."debug_logs" OWNER TO "supabase_read_only_user";


CREATE SEQUENCE IF NOT EXISTS "public"."debug_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- Prod: owned by supabase_read_only_user (created by accident); postgres cannot reproduce this.
-- ALTER TABLE "public"."debug_logs_id_seq" OWNER TO "supabase_read_only_user";


ALTER SEQUENCE "public"."debug_logs_id_seq" OWNED BY "public"."debug_logs"."id";



CREATE OR REPLACE VIEW "public"."mountain_snowfall_forecast" AS
 SELECT "caic_data"."mountain_id",
    "mountains"."slug",
    ("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text") AS "day",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (7)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (16)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "daytime_snowfall",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (17)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (23)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "nighttime_snowfall",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (0)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (6)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "prev_night_snowfall"
   FROM "public"."caic_data",
    "public"."mountains"
  WHERE (("mountains"."mountain_id" = "caic_data"."mountain_id") AND (("caic_data"."datetime" >= "now"()) AND ("caic_data"."datetime" <= ("now"() + '72:00:00'::interval))))
  GROUP BY "caic_data"."mountain_id", (("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text")), "mountains"."slug"
  ORDER BY "caic_data"."mountain_id", (("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text"));


ALTER TABLE "public"."mountain_snowfall_forecast" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."mountain_snowfall_historical" AS
 SELECT "caic_data"."mountain_id",
    "mountains"."slug",
    ("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text") AS "day",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (7)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (16)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "daytime_snowfall",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (17)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (23)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "nighttime_snowfall",
    "sum"(
        CASE
            WHEN ((EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) >= (0)::numeric) AND (EXTRACT(hour FROM ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) <= (6)::numeric)) THEN "caic_data"."snowfall_in"
            ELSE (0)::real
        END) AS "prev_night_snowfall"
   FROM "public"."caic_data",
    "public"."mountains"
  WHERE (("mountains"."mountain_id" = "caic_data"."mountain_id") AND ("mountains"."location_type" = 'backcountry'::"text") AND (("caic_data"."datetime" >= ("now"() - '7 days'::interval)) AND ("caic_data"."datetime" <= "now"())))
  GROUP BY "caic_data"."mountain_id", (("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text")), "mountains"."slug"
  ORDER BY "caic_data"."mountain_id", (("date_trunc"('day'::"text", ("caic_data"."datetime" AT TIME ZONE 'America/Denver'::"text")) AT TIME ZONE 'America/Denver'::"text"));


ALTER TABLE "public"."mountain_snowfall_historical" OWNER TO "postgres";


ALTER TABLE "public"."mountains" ALTER COLUMN "mountain_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mountains_mountain_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profile" (
    "email" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profile" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."resort_detail" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    "mountains"."slug",
    "mountains"."state",
    "mountains"."region",
    "mountains"."location_type",
    "resort_conditions"."closing_date",
    "resort_conditions"."base_depth",
    "resort_conditions"."snow_past_24h",
    "resort_conditions"."snow_past_48h",
    "resort_conditions"."snow_past_week",
    "resort_conditions"."snow_total",
    "resort_conditions"."snow_type",
    "resort_conditions"."lifts_open",
    "resort_conditions"."total_lifts",
    "resort_conditions"."runs_open",
    "resort_conditions"."total_runs",
    "resort_conditions"."updated_at",
    "resort_conditions"."snow_stake_url",
    "resort_conditions"."trails_url",
    "resort_conditions"."lifts_url",
    "public"."get_daily_weather_conditions"("mountains"."mountain_id") AS "daily_weather_conditions",
    "public"."get_hourly_weather_data"("mountains"."mountain_id") AS "hourly_forecast",
    "public"."get_next_24h_hourly_snowfall"("mountains"."mountain_id") AS "next_24h_hourly_snowfall",
    "public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_24h",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_72h",
    "public"."get_current_temperature_for_mountain"(("mountains"."mountain_id")::integer) AS "current_temp",
    "public"."get_current_weather_desc"("mountains"."mountain_id") AS "current_weather",
    "public"."get_temperature_range"("mountains"."mountain_id") AS "temperature_range",
    "public"."get_previous_snowfall_total"("mountains"."mountain_id") AS "previous_snowfall_totals",
    "public"."get_upcoming_snowfall_total"("mountains"."mountain_id") AS "upcoming_snowfall_totals"
   FROM "public"."mountains",
    "public"."resort_conditions"
  WHERE (("mountains"."location_type" = 'resort'::"text") AND ("resort_conditions"."mountain_id" = "mountains"."mountain_id"));


ALTER TABLE "public"."resort_detail" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."resort_overview" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    "mountains"."state",
    "mountains"."region",
    "mountains"."slug",
    "resort_conditions"."closing_date",
    COALESCE(("resort_conditions"."base_depth")::integer, '-1'::integer) AS "base_depth",
    "resort_conditions"."runs_open",
    "resort_conditions"."total_runs",
    "resort_conditions"."total_lifts",
    "resort_conditions"."lifts_open",
    COALESCE("resort_conditions"."snow_past_24h", ('-1'::integer)::numeric) AS "snow_past_24h",
    COALESCE("resort_conditions"."snow_past_48h", (0)::numeric) AS "snow_past_48h",
    "public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_24h",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "snow_next_72h",
    "public"."is_resort_closed"(("mountains"."mountain_id")::integer) AS "closed"
   FROM "public"."mountains",
    "public"."resort_conditions"
  WHERE ("resort_conditions"."mountain_id" = "mountains"."mountain_id");


ALTER TABLE "public"."resort_overview" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resort_snowfall_historical" (
    "mountain_id" smallint NOT NULL,
    "resort_snow_24h" numeric DEFAULT '0'::numeric,
    "caic_snow_24h" numeric,
    "date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."resort_snowfall_historical" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scraping_status" (
    "id" bigint NOT NULL,
    "display_name" "text" NOT NULL,
    "success" boolean NOT NULL,
    "time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "error" "text"
);


ALTER TABLE "public"."scraping_status" OWNER TO "postgres";


ALTER TABLE "public"."scraping_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."scraping_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."stale_snowfall_values" (
    "mountain_id" smallint NOT NULL,
    "stale_snow_past_24h" numeric,
    "stale_snow_past_48h" numeric
);


ALTER TABLE "public"."stale_snowfall_values" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_alerts" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "paused" boolean DEFAULT false NOT NULL,
    "email" "text" NOT NULL,
    "mountain_id" smallint,
    "threshold_inches" smallint NOT NULL,
    "display_name" "text"
);


ALTER TABLE "public"."user_alerts" OWNER TO "postgres";


ALTER TABLE "public"."user_alerts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_alerts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_devices" (
    "device_id" bigint NOT NULL,
    "user_id" "uuid",
    "subscription" "jsonb"
);


ALTER TABLE "public"."user_devices" OWNER TO "postgres";


ALTER TABLE "public"."user_devices" ALTER COLUMN "device_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_devices_device_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE OR REPLACE VIEW "public"."web_scraper_overview" AS
 SELECT ("get_display_name_with_highest_failure_count_last_24h"."get_display_name_with_highest_failure_count_last_24h" ->> 'display_name'::"text") AS "highest_failure_display_name_24h",
    (("get_display_name_with_highest_failure_count_last_24h"."get_display_name_with_highest_failure_count_last_24h" ->> 'total_failed_rows'::"text"))::bigint AS "highest_failure_total_rows_24h",
    (("get_display_name_with_highest_failure_count_last_24h"."get_display_name_with_highest_failure_count_last_24h" ->> 'percentage_failed'::"text"))::numeric AS "highest_failure_percentage_failed_24h",
    ("get_display_name_with_highest_failure_count"."get_display_name_with_highest_failure_count" ->> 'display_name'::"text") AS "highest_failure_display_name",
    (("get_display_name_with_highest_failure_count"."get_display_name_with_highest_failure_count" ->> 'total_failed_rows'::"text"))::bigint AS "highest_failure_total_rows",
    (("get_display_name_with_highest_failure_count"."get_display_name_with_highest_failure_count" ->> 'percentage_failed'::"text"))::numeric AS "highest_failure_percentage_failed",
    "public"."get_success_percentage"() AS "overall_success_percentage",
    "public"."get_success_percentage_24h"() AS "success_percentage_24h",
    "public"."get_recent_scraping_status"() AS "recent_scraping_status",
    "public"."count_errors_by_day"() AS "errors_per_day"
   FROM "public"."get_display_name_with_highest_failure_count_last_24h"() "get_display_name_with_highest_failure_count_last_24h"("get_display_name_with_highest_failure_count_last_24h"),
    "public"."get_display_name_with_highest_failure_count"() "get_display_name_with_highest_failure_count"("get_display_name_with_highest_failure_count"),
    "public"."get_success_percentage_24h"() "get_success_percentage_24h"("get_success_percentage_24h");


ALTER TABLE "public"."web_scraper_overview" OWNER TO "postgres";


ALTER TABLE ONLY "public"."debug_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."debug_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."avalanche_forecasts"
    ADD CONSTRAINT "avalanche_forecasts_mountain_id_key" UNIQUE ("mountain_id");



ALTER TABLE ONLY "public"."avalanche_forecasts"
    ADD CONSTRAINT "avalanche_forecasts_pkey" PRIMARY KEY ("mountain_id");



ALTER TABLE ONLY "public"."caic_data"
    ADD CONSTRAINT "caic_data_pkey" PRIMARY KEY ("mountain_id", "datetime");



ALTER TABLE ONLY "public"."debug_logs"
    ADD CONSTRAINT "debug_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mountains"
    ADD CONSTRAINT "mountains_display_name_key" UNIQUE ("display_name");



ALTER TABLE ONLY "public"."mountains"
    ADD CONSTRAINT "mountains_mountain_id_key" UNIQUE ("mountain_id");



ALTER TABLE ONLY "public"."mountains"
    ADD CONSTRAINT "mountains_pkey" PRIMARY KEY ("mountain_id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."resort_conditions"
    ADD CONSTRAINT "resort_conditions_pkey" PRIMARY KEY ("mountain_id");



ALTER TABLE ONLY "public"."resort_snowfall_historical"
    ADD CONSTRAINT "resort_snowfall_historical_pkey" PRIMARY KEY ("mountain_id", "date");



ALTER TABLE ONLY "public"."scraping_status"
    ADD CONSTRAINT "scraping_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stale_snowfall_values"
    ADD CONSTRAINT "stale_snowfall_values_mountain_id_key" UNIQUE ("mountain_id");



ALTER TABLE ONLY "public"."stale_snowfall_values"
    ADD CONSTRAINT "stale_snowfall_values_pkey" PRIMARY KEY ("mountain_id");



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_devices"
    ADD CONSTRAINT "user_devices_pkey" PRIMARY KEY ("device_id");



ALTER TABLE ONLY "public"."user_devices"
    ADD CONSTRAINT "user_devices_subscription_key" UNIQUE ("subscription");



CREATE INDEX "idx_caic_mountain_id" ON "public"."caic_data" USING "btree" ("mountain_id");



ALTER TABLE ONLY "public"."avalanche_forecasts"
    ADD CONSTRAINT "avalanche_forecasts_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resort_snowfall_historical"
    ADD CONSTRAINT "public_resort_snowfall_historical_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stale_snowfall_values"
    ADD CONSTRAINT "public_stale_snowfall_values_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resort_conditions"
    ADD CONSTRAINT "resort_conditions_display_name_fkey" FOREIGN KEY ("display_name") REFERENCES "public"."mountains"("display_name") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resort_conditions"
    ADD CONSTRAINT "resort_conditions_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_display_name_fkey" FOREIGN KEY ("display_name") REFERENCES "public"."mountains"("display_name") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_alerts"
    ADD CONSTRAINT "user_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_devices"
    ADD CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;













CREATE POLICY "Allow Insert for service role only" ON "public"."scraping_status" AS RESTRICTIVE FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Enable all operations for users based on their user_id" ON "public"."profile" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."mountains" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Enable insert for service role only" ON "public"."caic_data" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Enable insert for service role only" ON "public"."resort_conditions" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Enable operations for users based on user_id" ON "public"."user_alerts" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."caic_data" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."mountains" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."resort_conditions" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."scraping_status" FOR SELECT USING (true);



CREATE POLICY "Enable update for service role only" ON "public"."caic_data" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."avalanche_forecasts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."caic_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mountains" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resort_conditions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resort_snowfall_historical" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."scraping_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stale_snowfall_values" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_devices" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


SET SESSION AUTHORIZATION "postgres";
RESET SESSION AUTHORIZATION;



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."check_user_alerts"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_alerts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_alerts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."count_errors_by_day"() TO "anon";
GRANT ALL ON FUNCTION "public"."count_errors_by_day"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."count_errors_by_day"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_24h_alert_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_24h_alert_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_24h_alert_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_weather"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_weather"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_weather"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_weather_desc"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_weather_desc"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_weather_desc"("id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) TO "anon";
GRANT ALL ON FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_daily_weather_conditions"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_daily_weather_conditions"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_daily_weather_conditions"("mountain_id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count_last_24h"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count_last_24h"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_display_name_with_highest_failure_count_last_24h"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_most_recent_timestamp"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_most_recent_timestamp"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_most_recent_timestamp"("mountain_id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_next_24h_hourly_snowfall"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_next_24h_hourly_snowfall"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_next_24h_hourly_snowfall"("id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_overnight_alert_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_overnight_alert_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_overnight_alert_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_past_48_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_48_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_48_hour_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recent_scraping_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_recent_scraping_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recent_scraping_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_season_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_season_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_season_snowfall_for_mountain"("id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_success_percentage"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_success_percentage"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_success_percentage"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_success_percentage_24h"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_success_percentage_24h"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_success_percentage_24h"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_worst_scraping_job_overall"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_worst_scraping_job_overall"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_worst_scraping_job_overall"() TO "service_role";



GRANT ALL ON FUNCTION "public"."group_24h_forecast_alert_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."group_24h_forecast_alert_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."group_24h_forecast_alert_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."group_overnight_snowfall_alert_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."group_overnight_snowfall_alert_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."group_overnight_snowfall_alert_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_resort_closed"("resort_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."is_resort_closed"("resort_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_resort_closed"("resort_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."process_avalanche_forecast"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_avalanche_forecast"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_avalanche_forecast"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."process_avalanche_forecast_v2"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."process_avalanche_forecast_v2"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_avalanche_forecast_v2"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."process_resort_web_elements"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_resort_web_elements"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_resort_web_elements"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_resort_web_elements_am"() TO "anon";
GRANT ALL ON FUNCTION "public"."process_resort_web_elements_am"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_resort_web_elements_am"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_forecast_alert_emails"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_forecast_alert_emails"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_forecast_alert_emails"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_overnight_alert_emails"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_overnight_alert_emails"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_overnight_alert_emails"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_post_request"("mountain_name_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."send_post_request"("mountain_name_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_post_request"("mountain_name_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_resort_snowfall_historical"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_resort_snowfall_historical"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_resort_snowfall_historical"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_stale_snowfall_values"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_stale_snowfall_values"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_stale_snowfall_values"() TO "service_role";



SET SESSION AUTHORIZATION "postgres";
RESET SESSION AUTHORIZATION;



SET SESSION AUTHORIZATION "postgres";
RESET SESSION AUTHORIZATION;















GRANT ALL ON TABLE "public"."avalanche_forecasts" TO "anon";
GRANT ALL ON TABLE "public"."avalanche_forecasts" TO "authenticated";
GRANT ALL ON TABLE "public"."avalanche_forecasts" TO "service_role";



GRANT ALL ON TABLE "public"."mountains" TO "anon";
GRANT ALL ON TABLE "public"."mountains" TO "authenticated";
GRANT ALL ON TABLE "public"."mountains" TO "service_role";



GRANT ALL ON TABLE "public"."backcountry_overview" TO "anon";
GRANT ALL ON TABLE "public"."backcountry_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."backcountry_overview" TO "service_role";



GRANT ALL ON TABLE "public"."resort_conditions" TO "anon";
GRANT ALL ON TABLE "public"."resort_conditions" TO "authenticated";
GRANT ALL ON TABLE "public"."resort_conditions" TO "service_role";



GRANT ALL ON TABLE "public"."alert_thresholds" TO "anon";
GRANT ALL ON TABLE "public"."alert_thresholds" TO "authenticated";
GRANT ALL ON TABLE "public"."alert_thresholds" TO "service_role";



GRANT ALL ON SEQUENCE "public"."avalanche_forecasts_mountain_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."avalanche_forecasts_mountain_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."avalanche_forecasts_mountain_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."backcountry_detail" TO "anon";
GRANT ALL ON TABLE "public"."backcountry_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."backcountry_detail" TO "service_role";



GRANT ALL ON TABLE "public"."caic_data" TO "anon";
GRANT ALL ON TABLE "public"."caic_data" TO "authenticated";
GRANT ALL ON TABLE "public"."caic_data" TO "service_role";



GRANT ALL ON TABLE "public"."mountain_snowfall_forecast" TO "anon";
GRANT ALL ON TABLE "public"."mountain_snowfall_forecast" TO "authenticated";
GRANT ALL ON TABLE "public"."mountain_snowfall_forecast" TO "service_role";



GRANT ALL ON TABLE "public"."mountain_snowfall_historical" TO "anon";
GRANT ALL ON TABLE "public"."mountain_snowfall_historical" TO "authenticated";
GRANT ALL ON TABLE "public"."mountain_snowfall_historical" TO "service_role";



GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";



GRANT ALL ON TABLE "public"."resort_detail" TO "anon";
GRANT ALL ON TABLE "public"."resort_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."resort_detail" TO "service_role";



GRANT ALL ON TABLE "public"."resort_overview" TO "anon";
GRANT ALL ON TABLE "public"."resort_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."resort_overview" TO "service_role";



GRANT ALL ON TABLE "public"."resort_snowfall_historical" TO "anon";
GRANT ALL ON TABLE "public"."resort_snowfall_historical" TO "authenticated";
GRANT ALL ON TABLE "public"."resort_snowfall_historical" TO "service_role";



GRANT ALL ON TABLE "public"."scraping_status" TO "anon";
GRANT ALL ON TABLE "public"."scraping_status" TO "authenticated";
GRANT ALL ON TABLE "public"."scraping_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."scraping_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scraping_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scraping_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stale_snowfall_values" TO "anon";
GRANT ALL ON TABLE "public"."stale_snowfall_values" TO "authenticated";
GRANT ALL ON TABLE "public"."stale_snowfall_values" TO "service_role";



GRANT ALL ON TABLE "public"."user_alerts" TO "anon";
GRANT ALL ON TABLE "public"."user_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."user_alerts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_alerts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_devices" TO "anon";
GRANT ALL ON TABLE "public"."user_devices" TO "authenticated";
GRANT ALL ON TABLE "public"."user_devices" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_devices_device_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_devices_device_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_devices_device_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."web_scraper_overview" TO "anon";
GRANT ALL ON TABLE "public"."web_scraper_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."web_scraper_overview" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

-- Not captured by the public-schema dump: profile creation trigger on auth.users.
CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

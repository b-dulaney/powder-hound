
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > (now() at time zone 'MST') and datetime < (now() at time zone 'MST'+ interval '24 hours'))::numeric, 1);
end;
$$;

ALTER FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_72_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime > (now() at time zone 'MST') and datetime < (now() at time zone 'MST' + interval '72 hours'))::numeric, 1);
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
  return (select temp from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour');
end;
$$;

ALTER FUNCTION "public"."get_current_temperature_for_mountain"("id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_current_weather_desc"("id" smallint) RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
begin
  return (select LOWER(weather_desc) from caic_data where mountain_id = id and datetime <= current_timestamp at time zone 'MST' and datetime > current_timestamp at time zone 'MST' - interval '1 hour');
end;
$$;

ALTER FUNCTION "public"."get_current_weather_desc"("id" smallint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_daily_weather"("lat" real, "lon" real) RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$begin
  RETURN(select content::json
  from http_get(concat('https://api.openweathermap.org/data/2.5/onecall?lat=', lat, '&lon=', lon, '&units=imperial&exclude=minutely,hourly&appid=3a43dad25de3dbb7d2b839d150861147')));

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
      AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '1 day')::date
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
      AND datetime >= current_timestamp at time zone 'MST' - interval '6 hours'
      AND datetime <= current_timestamp at time zone 'MST' + interval '16 hours'
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

CREATE OR REPLACE FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((
    select sum(snowfall_in)
    from caic_data
    where mountain_id = id
    and datetime >= (now() at time zone 'MST' - interval '24 hours') and datetime <= (now() at time zone 'MST')
  )::numeric, 1);
end;
$$;

ALTER FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
begin
  return round((select sum(snowfall_in) from caic_data where mountain_id = id and datetime::date >= (now() at time zone 'MST' - interval '7 days')::date and datetime <= (now() at time zone 'MST'))::numeric, 1);
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
            caic_data.datetime::date AS date,
            sum(snowfall_in) AS snowfall_total
        FROM
            caic_data
        WHERE
            caic_data.mountain_id = $1
            AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '7 days')::date
            AND caic_data.datetime <= (now() at time zone 'MST')
        GROUP BY
            caic_data.datetime::date
        ORDER BY
            caic_data.datetime::date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', TO_CHAR(date, 'mm/dd'),
                'snowfall_total', snowfall_total
            )
        ) INTO result
    FROM
        SnowfallTotalCTE;

    RETURN result;
END;
$_$;

ALTER FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_temperature_range"("id" smallint) RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    result jsonb;
BEGIN
    WITH TemperatureMinMax AS (
        SELECT
            caic_data.datetime::date AS date,
            max(caic_data.temp) AS high_temp,
            min(caic_data.temp) AS low_temp
        FROM
            caic_data
        WHERE
            mountain_id = $1
            AND caic_data.datetime::date >= (now() at time zone 'MST' - interval '1 day')::date
        GROUP BY
            caic_data.datetime::date
        ORDER by
            caic_data.datetime::date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', date,
                'high_temp', high_temp,
                'low_temp', low_temp
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
            caic_data.datetime::date AS date,
            sum(snowfall_in) AS snowfall_total
        FROM
            caic_data
        WHERE
            caic_data.mountain_id = $1
            AND caic_data.datetime <= current_timestamp + interval '72 hours'
            AND caic_data.datetime >= current_timestamp at time zone 'MST'
        GROUP BY
            date
        ORDER BY
            date
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'date', TO_CHAR(date, 'mm/dd'),
                'snowfall_total', snowfall_total
            )
        ) INTO result
    FROM
        SnowfallTotalCTE;

    RETURN result;
END;
$_$;

ALTER FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."caic_data" (
    "mountain_id" smallint NOT NULL,
    "datetime" timestamp without time zone NOT NULL,
    "temp" smallint NOT NULL,
    "wind_deg_speed" character varying NOT NULL,
    "wind_gust" smallint NOT NULL,
    "weather_desc" character varying,
    "snowfall_in" real NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cei" smallint,
    "cnpcp_in" real,
    "dew_point" smallint,
    "ncpcp_in" real,
    "relative_humidity" smallint,
    "visbility_miles" real NOT NULL,
    "wetbulb_temp" smallint
);

ALTER TABLE "public"."caic_data" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."mountains" (
    "mountain_id" smallint NOT NULL,
    "display_name" "text" NOT NULL,
    "lat" real NOT NULL,
    "lon" real NOT NULL,
    "region" character varying NOT NULL,
    "caic_code" character varying NOT NULL,
    "model_elevation" smallint NOT NULL,
    "location_type" "text" NOT NULL,
    "slug" "text"
);

ALTER TABLE "public"."mountains" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."mountain_detail" AS
 SELECT "mountains"."mountain_id",
    "mountains"."display_name",
    "mountains"."slug",
    "mountains"."region",
    "mountains"."location_type",
    "mountains"."lat",
    "mountains"."lon",
    "mountains"."model_elevation" AS "elevation",
    "public"."get_daily_weather_conditions"("mountains"."mountain_id") AS "daily_weather_conditions",
    "public"."get_hourly_weather_data"("mountains"."mountain_id") AS "hourly_forecast",
    "public"."get_past_7_days_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "past7daysnowfall",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "next72hoursnowfall",
    "public"."get_current_temperature_for_mountain"(("mountains"."mountain_id")::integer) AS "current_temperature",
    "public"."get_current_weather_desc"("mountains"."mountain_id") AS "current_weather",
    "public"."get_temperature_range"("mountains"."mountain_id") AS "temperature_range",
    "public"."get_previous_snowfall_total"("mountains"."mountain_id") AS "previous_snowfall_totals",
    "public"."get_upcoming_snowfall_total"("mountains"."mountain_id") AS "upcoming_snowfall_totals"
   FROM "public"."mountains";

ALTER TABLE "public"."mountain_detail" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."mountain_overview" AS
 SELECT "mountains"."display_name",
    "mountains"."region",
    "mountains"."location_type",
    "mountains"."slug",
    "public"."get_current_temperature_for_mountain"(("mountains"."mountain_id")::integer) AS "currenttemp",
    "public"."get_current_weather_desc"("mountains"."mountain_id") AS "weather_desc",
    "public"."get_past_7_days_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "past7daysnowfall",
    "public"."get_past_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "past24hoursnowfall",
    "public"."get_24_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "next24hoursnowfall",
    "public"."get_72_hour_snowfall_for_mountain"(("mountains"."mountain_id")::integer) AS "next72hoursnowfall"
   FROM "public"."mountains";

ALTER TABLE "public"."mountain_overview" OWNER TO "postgres";

ALTER TABLE "public"."mountains" ALTER COLUMN "mountain_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mountains_mountain_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profile" (
    "id" bigint NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "user_id" "uuid"
);

ALTER TABLE "public"."profile" OWNER TO "postgres";

ALTER TABLE "public"."profile" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profile_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."caic_data"
    ADD CONSTRAINT "caic_data_pkey" PRIMARY KEY ("mountain_id", "datetime");

ALTER TABLE ONLY "public"."mountains"
    ADD CONSTRAINT "mountains_pkey" PRIMARY KEY ("mountain_id");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_caic_mountain_id" ON "public"."caic_data" USING "btree" ("mountain_id");

ALTER TABLE ONLY "public"."caic_data"
    ADD CONSTRAINT "caic_data_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "public"."mountains"("mountain_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable insert for authenticated users only" ON "public"."mountains" FOR INSERT TO "service_role" WITH CHECK (true);

CREATE POLICY "Enable insert for service role only" ON "public"."caic_data" FOR INSERT TO "service_role" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."caic_data" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."mountains" FOR SELECT USING (true);

CREATE POLICY "Enable update for service role only" ON "public"."caic_data" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);

ALTER TABLE "public"."caic_data" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."mountains" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_24_hour_snowfall_for_mountain"("id" integer) TO "service_role";

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

GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_hourly_weather_data"("id" smallint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_24_hour_snowfall_for_mountain"("id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_past_7_days_snowfall_for_mountain"("id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_previous_snowfall_total"("mountain_id" smallint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_temperature_range"("id" smallint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_upcoming_snowfall_total"("mountain_id" smallint) TO "service_role";

GRANT ALL ON TABLE "public"."caic_data" TO "anon";
GRANT ALL ON TABLE "public"."caic_data" TO "authenticated";
GRANT ALL ON TABLE "public"."caic_data" TO "service_role";

GRANT ALL ON TABLE "public"."mountains" TO "anon";
GRANT ALL ON TABLE "public"."mountains" TO "authenticated";
GRANT ALL ON TABLE "public"."mountains" TO "service_role";

GRANT ALL ON TABLE "public"."mountain_detail" TO "anon";
GRANT ALL ON TABLE "public"."mountain_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."mountain_detail" TO "service_role";

GRANT ALL ON TABLE "public"."mountain_overview" TO "anon";
GRANT ALL ON TABLE "public"."mountain_overview" TO "authenticated";
GRANT ALL ON TABLE "public"."mountain_overview" TO "service_role";

GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mountains_mountain_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";

GRANT ALL ON SEQUENCE "public"."profile_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profile_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profile_id_seq" TO "service_role";

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

RESET ALL;

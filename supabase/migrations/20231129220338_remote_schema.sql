alter table "public"."conditions" drop constraint "conditions_mountain_id_fkey";

alter table "public"."weekly_forecasts" drop constraint "weekly_forecasts_mountain_id_fkey";

alter table "public"."conditions" drop constraint "conditions_pkey";

alter table "public"."weekly_forecasts" drop constraint "weekly_forecasts_pkey";

alter table "public"."snow_accumulation" drop constraint "snow_accumulation_pkey";

drop index if exists "public"."conditions_pkey";

drop index if exists "public"."weekly_forecasts_pkey";

drop index if exists "public"."snow_accumulation_pkey";

drop table "public"."conditions";

create table "public"."caic_data" (
    "mountain_id" smallint not null,
    "datetime" timestamp without time zone not null,
    "temp" smallint,
    "wind_deg_speed" character varying,
    "wind_gust" smallint,
    "weather_desc" character varying,
    "snowfall_in" real,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."daily_forecasts" add column "updated_at" timestamp with time zone default now();

alter table "public"."daily_forecasts" alter column "current_temp" set data type numeric using "current_temp"::numeric;

alter table "public"."daily_forecasts" alter column "daily_high" set data type numeric using "daily_high"::numeric;

alter table "public"."daily_forecasts" alter column "daily_low" set data type numeric using "daily_low"::numeric;

alter table "public"."daily_forecasts" alter column "feels_like" set data type numeric using "feels_like"::numeric;

alter table "public"."daily_forecasts" alter column "snow_tomorrow" set data type real using "snow_tomorrow"::real;

alter table "public"."daily_forecasts" alter column "uv_index" set data type numeric using "uv_index"::numeric;

alter table "public"."daily_forecasts" alter column "wind_speed" set data type numeric using "wind_speed"::numeric;

alter table "public"."daily_forecasts" disable row level security;

alter table "public"."mountains" drop column "country";

alter table "public"."mountains" drop column "state_province";

alter table "public"."mountains" add column "caic_code" character varying;

alter table "public"."mountains" add column "model_elevation" smallint;

alter table "public"."mountains" alter column "display_name" set not null;

alter table "public"."mountains" alter column "lat" set not null;

alter table "public"."mountains" alter column "lon" set not null;

alter table "public"."mountains" alter column "region" set data type character varying using "region"::character varying;

alter table "public"."snow_accumulation" drop column "id";

alter table "public"."snow_accumulation" alter column "date" set not null;

alter table "public"."snow_accumulation" alter column "mountain_id" set not null;

alter table "public"."snow_accumulation" disable row level security;

alter table "public"."weekly_forecasts" drop column "id";

alter table "public"."weekly_forecasts" add column "updated_at" timestamp with time zone default now();

alter table "public"."weekly_forecasts" alter column "daily_high" set data type numeric using "daily_high"::numeric;

alter table "public"."weekly_forecasts" alter column "daily_low" set data type numeric using "daily_low"::numeric;

alter table "public"."weekly_forecasts" alter column "date" set not null;

alter table "public"."weekly_forecasts" alter column "date" set data type timestamp with time zone using "date"::timestamp with time zone;

alter table "public"."weekly_forecasts" alter column "mountain_id" set not null;

alter table "public"."weekly_forecasts" alter column "uv_index" set data type numeric using "uv_index"::numeric;

alter table "public"."weekly_forecasts" alter column "wind_speed" set data type numeric using "wind_speed"::numeric;

alter table "public"."weekly_forecasts" disable row level security;

CREATE UNIQUE INDEX caic_data_pkey ON public.caic_data USING btree (mountain_id, datetime);

CREATE UNIQUE INDEX weekly_forecasts_duplicate_pkey ON public.weekly_forecasts USING btree (mountain_id, date);

CREATE UNIQUE INDEX snow_accumulation_pkey ON public.snow_accumulation USING btree (mountain_id, date);

alter table "public"."caic_data" add constraint "caic_data_pkey" PRIMARY KEY using index "caic_data_pkey";

alter table "public"."weekly_forecasts" add constraint "weekly_forecasts_duplicate_pkey" PRIMARY KEY using index "weekly_forecasts_duplicate_pkey";

alter table "public"."snow_accumulation" add constraint "snow_accumulation_pkey" PRIMARY KEY using index "snow_accumulation_pkey";

alter table "public"."caic_data" add constraint "caic_data_mountain_id_fkey" FOREIGN KEY (mountain_id) REFERENCES mountains(mountain_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."caic_data" validate constraint "caic_data_mountain_id_fkey";

alter table "public"."weekly_forecasts" add constraint "weekly_forecasts_mountain_id_fkey" FOREIGN KEY (mountain_id) REFERENCES mountains(mountain_id) not valid;

alter table "public"."weekly_forecasts" validate constraint "weekly_forecasts_mountain_id_fkey";



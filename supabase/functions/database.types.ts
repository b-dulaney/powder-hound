import type { PostgrestError } from "@supabase/supabase-js";
import type { Database as DatabaseGenerated } from "./supabase-generated.types";
import type { MergeDeep } from "type-fest";

export type TemperatureRange = {
  date: string;
  low_temp: number;
  high_temp: number;
  snowfall: number;
};

export type AlertThreshold = {
  id: number;
  name: string;
  threshold: number;
};

export type DailyWeatherCondition = {
  date: string;
  daily_weather: string;
};

export type SnowfallTotal = {
  date: string;
  snowfall_total: number;
};

export type HourlyWeatherData = {
  datetime: string;
  temp: number;
  wind_gust: number;
  snowfall: number;
  weather_desc: string;
  wind_deg_speed: string;
};

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        mountain_overview: {
          Row: {
            mountain_id: number;
            display_name: string;
            slug: string;
            location_type: string;
            currenttemp: number;
            weather_desc: string;
            next24hoursnowfall: number;
            next72hoursnowfall: number;
            past24hoursnowfall: number;
            past7daysnowfall: number;
            region: string;
          };
        };
        mountain_details: {
          Row: {
            current_temperature: number;
            current_weather: string;
            display_name: string;
            elevation: number;
            lat: number;
            location_type: string;
            next72hoursnowfall: number;
            past7daysnowfall: number;
            lon: number;
            mountain_id: number;
            region: string;
            slug: string;
            hourly_forecast: HourlyWeatherData[];
            daily_weather_conditions: DailyWeatherCondition[];
            previous_snowfall_totals: SnowfallTotal[];
            upcoming_snowfall_totals: SnowfallTotal[];
            temperature_range: TemperatureRange[];
          };
        };
      };
      Tables: {
        profile: {
          Row: {
            id: number;
            fist_name: string | null;
            last_name: string | null;
            email: string | null;
            user_id: string | null;
            favorites: number[];
            alert_thresholds: AlertThreshold[];
          };
        };
        resort_conditions: {
          Row: {
            mountain_id: number;
            display_name: string;
            base_depth: number;
            total_lifts: number;
            lifts_open: number;
            lifts_open_percent: number;
            total_runs: number;
            runs_open: number;
            runs_open_percent: number;
            snow_past_24h: number;
            snow_past_48h: number;
            snow_past_week: number;
            snow_total: number;
            snow_type: string;
            website_url: string;
            snow_stake_url: number;
          };
        };
        resort_web_elements: {
          Row: {
            mountain_id: number;
            conditions_url: string;
            trail_report_url: string | null;
            base_depth_el: string;
            lifts_open_el: string | null;
            runs_open_el: string | null;
            snow_past_24h_el: string;
            snow_past_48h_el: string;
            snow_past_week_el: string | null;
            snow_total_el: string | null;
            snow_type_el: string | null;
          };
        };
      };
    };
  }
>;

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

export type Mountain = Tables<"mountains">;
export type CaicData = Tables<"caic_data">;
export type Profile = Tables<"profile">;
export type ResortConditions = Tables<"resort_conditions">;
export type ResortWebElements = Tables<"resort_web_elements">;
export type MountainOverview = Views<"mountain_overview">;
export type MountainDetail = Views<"mountain_details">;

type TableTypes =
  | Mountain
  | CaicData
  | ResortConditions
  | ResortWebElements
  | Profile;

export type DbResult<T extends TableTypes> = {
  data: T[] | null;
  error: PostgrestError | null;
};

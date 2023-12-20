import type { PostgrestError } from '@supabase/supabase-js';
import type { Database as DatabaseGenerated } from './supabase-generated.types';
import type { MergeDeep } from 'type-fest'

export type TemperatureRange = {
  date: string;
  low_temp: number;
  high_temp: number;
}

export type DailyWeatherCondition = {
  date: string;
  weather_desc: string;
}

export type SnowfallTotal = {
  date: string;
  snowfall_total: number;
}

export type HourlyWeatherData = {
  datetime: string;
  temp: number;
  wind_gust: number;
  weather_desc: string;
  wing_deg_speed: string;
}

export type Database = MergeDeep<DatabaseGenerated, {
  public: {
    Views: {
      hourly_forecast: {
        Row: {
          mountain_id: number;
          display_name: string;
          hourly_weather_data: HourlyWeatherData[];
        }
      },
      mountain_overview: {
        Row: {
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
        }
      },
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
          daily_weather_conditions: DailyWeatherCondition[];
          previous_snowfall_totals: SnowfallTotal[];
          upcoming_snowfall_totals: SnowfallTotal[];
          temperature_range: TemperatureRange[];
        }
      }
    }
  }
}>

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']

export type Mountain = Tables<'mountains'>
export type SnowAccumulation = Tables<'snow_accumulation'>
export type DailyForecast = Tables<'daily_forecasts'>
export type WeeklyForecast =Tables<'weekly_forecasts'>
export type CaicData = Tables<'caic_data'>
export type MountainOverview = Views<'mountain_overview'>
export type MountainDetail = Views<'mountain_details'>
export type HourlyForecast = Views<'hourly_forecast'>

type TableTypes = Mountain | SnowAccumulation | DailyForecast | WeeklyForecast | CaicData;

export type DbResult<T extends TableTypes> = {
  data: T[] | null;
  error: PostgrestError | null;
};
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database as DatabaseGenerated } from './supabase-generated.types';
import type { MergeDeep } from 'type-fest'

export type Database = MergeDeep<DatabaseGenerated, {
  public: {
    Views: {
      mountain_overview: {
        Row: {
          display_name: string;
          slug: string;
          location_type: string;
          currenttemp: number;
          next24hoursnowfall: number;
          next72hoursnowfall: number;
          past24hoursnowfall: number;
          past5daysnowfall: number;
          region: string;
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

type TableTypes = Mountain | SnowAccumulation | DailyForecast | WeeklyForecast | CaicData;

export type DbResult<T extends TableTypes> = {
  data: T[] | null;
  error: PostgrestError | null;
};
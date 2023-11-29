import type { PostgrestError } from 'https://esm.sh/@supabase/supabase-js@2';
import { Database } from './database-generated.types.ts';


export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Mountain = Tables<'mountains'>
export type SnowAccumulation = Tables<'snow_accumulation'>
export type DailyForecast = Tables<'daily_forecasts'>
export type WeeklyForecast =Tables<'weekly_forecasts'>
export type CaicData = Tables<'caic_data'>

type TableTypes = Mountain | SnowAccumulation | DailyForecast | WeeklyForecast | CaicData;

export type DbResult<T extends TableTypes> = {
  data: T[] | null;
  error: PostgrestError | null;
};
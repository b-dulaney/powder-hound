import { PostgrestError } from '@supabase/supabase-js'
import { Database } from './database-generated.types'


export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError

export type Mountain = Partial<Tables<'mountains'>>
export type SnowAccumulation = Partial<Tables<'snow_accumulation'>>
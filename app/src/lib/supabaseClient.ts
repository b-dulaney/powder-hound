import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY } from '$env/static/private'

export const supabase = createClient('https://zfwpqcadelgvmvjmfuxi.supabase.co', SUPABASE_ANON_KEY)
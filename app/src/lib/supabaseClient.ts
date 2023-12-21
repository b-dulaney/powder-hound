import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY } from '$env/static/private';
import type { Database } from './supabase-generated.types.ts';

export const supabase = createClient<Database>(
	'https://zfwpqcadelgvmvjmfuxi.supabase.co',
	SUPABASE_ANON_KEY
);

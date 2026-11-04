import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import type { Database } from '$lib/supabase-generated.types';

/**
 * Privileged Supabase client (secret key — bypasses RLS). Server-only: SvelteKit refuses to bundle
 * anything under $lib/server into client code.
 *
 * Use only for operations that genuinely need admin rights (e.g. auth.admin.deleteUser), and only
 * after authorizing the caller with `locals.getUser()`. Never pass user-supplied IDs to it.
 */
export const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});

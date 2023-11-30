/* eslint-disable @typescript-eslint/no-explicit-any */
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Database } from '$lib/supabase-generated.types';
import { createServerClient } from '@supabase/ssr'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: ReturnType<typeof createServerClient<Database>>
			getSession(): Promise<any>
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

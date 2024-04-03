import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Database } from '$lib/supabase-generated.types.ts';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	);

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session },
			error
		} = await event.locals.supabase.auth.getSession();
		if (error) {
			console.error('Error getting session:', error.message);
			const cookies = event.cookies.getAll();
			cookies.forEach((cookie) => {
				if (cookie.name.startsWith('sb-')) {
					event.cookies.delete(cookie.name, { path: '/' });
				}
			});
		}
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

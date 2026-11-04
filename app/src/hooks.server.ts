import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import type { Database } from '$lib/supabase-generated.types.ts';

export const handle: Handle = async ({ event, resolve }) => {
	// Per-request client acting as the signed-in user (or anon). Uses the publishable key so RLS
	// applies; privileged operations go through $lib/server/supabase-admin instead.
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
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
		let {
			data: { session },
			// eslint-disable-next-line prefer-const
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

			const { data: getUserData, error: getUserError } = await event.locals.supabase.auth.getUser();
			if (getUserData.user == null || getUserError) {
				session = null;
			}
		}
		return session;
	};

	/**
	 * Returns the authenticated user, verified with the Auth server. Use this (not getSession) for
	 * authorization decisions: getSession only decodes the cookie, which the client controls.
	 */
	event.locals.getUser = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		return error ? null : user;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

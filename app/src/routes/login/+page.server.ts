import { PUBLIC_SITE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async (event) => {
		const { supabase } = event.locals;
		const data = await event.request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${PUBLIC_SITE_URL}/auth/callback`
			}
		});

		if (error) {
			return {
				success: false,
				body: error.message
			};
		}

		return { success: true, email };
	}
};

export const load = async (event) => {
	const session = await event.locals.getSession();

	if (session) {
		return redirect(301, '/conditions');
	}

	return {};
};

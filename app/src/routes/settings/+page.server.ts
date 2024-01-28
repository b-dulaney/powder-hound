import type { Profile } from '$lib/supabase.types.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = await event.locals.getSession();
	const { supabase } = event.locals;
	if (!session || !session.user) {
		return redirect(301, '/login');
	}

	const { data: profileData, error: profileError } = await supabase
		.from('profile')
		.select()
		.returns<Profile[]>()
		.maybeSingle();

	if (profileError) {
		error(500, profileError.message);
	}

	return {
		profile: profileData
	};
};

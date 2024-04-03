import type { Profile } from '$lib/supabase.types.js';
import { handleInvalidAuthToken } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const { supabase } = event.locals;
	if (!session || !session.user) {
		redirect(301, '/login');
	}

	const { data: profileData, error: profileError } = await supabase
		.from('profile')
		.select()
		.returns<Profile[]>()
		.maybeSingle();

	if (profileError) {
		if (profileError.code === 'PGRST301') {
			await handleInvalidAuthToken(event);
			return load(event);
		} else {
			error(500, 'Error fetching conditions data');
		}
	}

	return {
		profile: profileData
	};
};

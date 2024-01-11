import type { MountainOverview } from '$lib/supabase.types';
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	const { data: mountains, error: mountainsError } = await supabase
		.from('mountain_overview')
		.select()
		.returns<MountainOverview[]>();

	if (mountainsError) {
		return {
			status: 500,
			error: mountainsError.message
		};
	} else {
		if (!session) {
			return {
				mountainOverviews: mountains.sort((a, b) => (a.display_name > b.display_name ? 1 : -1))
			};
		}
		const { data: profileData, error: profileError } = await supabase.from('profile').select();

		if (profileError) {
			return {
				status: 500,
				error: profileError.message
			};
		}
		return {
			mountainOverviews: mountains.sort((a, b) => (a.display_name > b.display_name ? 1 : -1)),
			profile: profileData[0]
		};
	}
};

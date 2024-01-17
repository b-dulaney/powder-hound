import type { BackcountryOverview, MountainOverview } from '$lib/supabase.types';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	const { data: resortData, error: resortError } = await supabase
		.from('mountain_overview')
		.select()
		.returns<MountainOverview[]>();

	const { data: backcountryData, error: backcountryError } = await supabase
		.from('backcountry_overview')
		.select()
		.returns<BackcountryOverview[]>();

	if (resortError || backcountryError) {
		error(500, 'Error fetching conditions data');
	}

	if (!session) {
		return {
			resortOverviews: resortData.sort((a, b) => (a.display_name > b.display_name ? 1 : -1)),
			backcountryOverviews: backcountryData.sort((a, b) =>
				a.display_name > b.display_name ? 1 : -1
			)
		};
	}
	const { data: profileData, error: profileError } = await supabase.from('profile').select();

	if (profileError) {
		error(500, 'Error fetching profile data');
	}
	return {
		resortOverviews: resortData.sort((a, b) => (a.display_name > b.display_name ? 1 : -1)),
		backcountryOverviews: backcountryData.sort((a, b) =>
			a.display_name > b.display_name ? 1 : -1
		),
		profile: profileData[0]
	};
};

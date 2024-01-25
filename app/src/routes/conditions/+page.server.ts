import type { BackcountryOverview, ResortOverview } from '$lib/supabase.types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const { supabase } = event.locals;

	const accessToken = session?.access_token;
	const refreshToken = session?.refresh_token;
	if (accessToken && refreshToken) {
		await supabase.auth.setSession({
			access_token: session.access_token,
			refresh_token: session.refresh_token
		});
	}

	const { data: resortData, error: resortError } = await supabase
		.from('resort_overview')
		.select()
		.returns<ResortOverview[]>();

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

import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { depends } = event;
	depends('supabase:auth');
	depends('update:alerts');

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

	const { data: backcountryData, error: backcountryError } = await supabase
		.from('backcountry_overview')
		.select()
		.returns<BackcountryOverview[]>();

	if (backcountryError) {
		error(500, 'Error fetching backcountry conditions data');
	}

	if (!session) {
		return {
			backcountryOverviews: backcountryData.sort((a, b) =>
				a.display_name > b.display_name ? 1 : -1
			)
		};
	}

	const { data: alertsData, error: alertsError } = await supabase
		.from('user_alerts')
		.select()
		.returns<UserAlerts[]>();

	if (alertsError) {
		error(500, 'Error fetching profile data');
	}

	return {
		backcountryOverviews: backcountryData,
		alerts: alertsData
	};
};

import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handleInvalidAuthToken } from '$lib/utils';

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

	const { data: backcountryData, error: backcountryError } = await supabase
		.from('backcountry_overview')
		.select()
		.returns<BackcountryOverview[]>();

	if (backcountryError) {
		console.error(`${backcountryError.code} - ${backcountryError.message}`);
		if (backcountryError.code === 'PGRST301') {
			await handleInvalidAuthToken(event);
			return load(event);
		} else {
			error(500, 'Error fetching conditions data');
		}
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
		console.error(`${alertsError.code} - ${alertsError.message}`);
		if (alertsError.code === 'PGRST301') {
			await handleInvalidAuthToken(event);
			return load(event);
		} else {
			error(500, 'Error fetching conditions data');
		}
	}

	return {
		backcountryOverviews: backcountryData,
		alerts: alertsData
	};
};

import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
import { handleInvalidAuthToken } from '$lib/utils';
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

	if (resortError) {
		console.error(`${resortError.code} - ${resortError.message}`);
		if (resortError.code === 'PGRST301') {
			await handleInvalidAuthToken(event);
			return load(event);
		} else {
			error(500, 'Error fetching conditions data');
		}
	}

	if (!session) {
		return {
			resortOverviews: resortData.sort((a, b) => (a.display_name > b.display_name ? 1 : -1))
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
		resortOverviews: resortData,
		alerts: alertsData
	};
};

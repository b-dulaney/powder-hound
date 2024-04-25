import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
import { handleInvalidAuthToken } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostgrestError } from '@supabase/supabase-js';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const { supabase } = event.locals;
	const { fetch } = event;

	const accessToken = session?.access_token;
	const refreshToken = session?.refresh_token;
	if (accessToken && refreshToken) {
		await supabase.auth.setSession({
			access_token: session.access_token,
			refresh_token: session.refresh_token
		});
	}

	const backcountryResponse = await fetch(
		`/api/snow-report?view=backcountry_overview&sort=display_name&order=asc`
	);

	const {
		data: backcountryData,
		error: backcountryError
	}: { data: BackcountryOverview[] | null; error: PostgrestError | null } =
		await backcountryResponse.json();

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
			backcountryOverviews: backcountryData
		};
	}

	const { data: alertsData, error: alertsError } = await supabase
		.from('user_alerts')
		.select()
		.eq('user_id', session.user.id)
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

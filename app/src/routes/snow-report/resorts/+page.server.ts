import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
import { handleInvalidAuthToken } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PostgrestError } from '@supabase/supabase-js';

export const load: PageServerLoad = async (event) => {
	const { depends } = event;
	depends('update:alerts');
	depends('update:existingAlert');
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

	const resortResponse = await fetch(
		`/api/snow-report?view=resort_overview&sort=display_name&order=asc&closed=false`
	);

	const {
		data: resortData,
		error: resortError
	}: { data: ResortOverview[] | null; error: PostgrestError | null } = await resortResponse.json();

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
			resortOverviews: resortData
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
		resortOverviews: resortData,
		alerts: alertsData
	};
};

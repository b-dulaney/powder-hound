import type { UserAlerts } from '$lib/supabase.types';
import { handleInvalidAuthToken } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { supabase } = event.locals;
	const session = await event.locals.getSession();
	if (!session) {
		redirect(301, '/login');
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

	if (!alertsData.length) {
		redirect(301, '/alerts/initial-setup');
	}

	return {
		alerts: alertsData.sort((a, b) => (a.display_name > b.display_name ? 1 : -1)) as UserAlerts[]
	};
};

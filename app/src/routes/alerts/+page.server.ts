import type { UserAlerts } from '$lib/supabase.types';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { supabase } = event.locals;
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(301, '/login');
	}

	await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token
	});

	const { data: alertsData, error: alertsError } = await supabase
		.from('user_alerts')
		.select()
		.returns<UserAlerts[]>();

	if (alertsError) {
		error(500);
	}

	if (!alertsData.length) {
		redirect(301, '/alerts/initial-setup');
	}

	return {
		alerts: alertsData.sort((a, b) => (a.display_name > b.display_name ? 1 : -1))
	};
};

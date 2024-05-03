import type { UserAlerts } from '$lib/supabase.types';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { supabase } = event.locals;
	const session = await event.locals.getSession();
	if (!session) {
		redirect(301, '/login');
	}

	await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token
	});

	const { data: alertsData, error: alertsError } = await supabase
		.from('user_alerts')
		.select()
		.eq('user_id', session.user.id)
		.returns<UserAlerts[]>();

	const { data: mountainData, error: mountainError } = await supabase
		.from('mountains')
		.select('mountain_id, display_name, location_type')
		.order('display_name', { ascending: true });

	if (alertsData && alertsData.length === 0) {
		return {
			userId: session.user.id,
			email: session.user.email,
			mountainData
		};
	}

	if (alertsData && alertsData.length > 0) {
		redirect(301, '/alerts');
	}

	if (alertsError || mountainError) {
		error(500);
	}
};

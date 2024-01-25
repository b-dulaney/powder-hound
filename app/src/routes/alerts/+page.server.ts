import type { Profile, UserAlerts } from '$lib/supabase.types';
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

	const { data: profileData, error: profileError } = await supabase
		.from('profile')
		.select()
		.returns<Profile[]>()
		.maybeSingle();

	if (!profileData && !profileError) {
		redirect(301, '/alerts/initial-setup');
	}

	if (profileData) {
		const { data: alertsData, error: alertsError } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>()
			.maybeSingle();

		if (alertsError) {
			error(500);
		}

		return {
			userProfile: profileData,
			alerts: alertsData?.alert_thresholds
		};
	}

	error(500);
};

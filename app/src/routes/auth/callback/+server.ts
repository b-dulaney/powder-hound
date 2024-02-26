import type { UserAlerts } from '$lib/supabase.types';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase, getSession }
	} = event;
	const code = url.searchParams.get('code') as string;
	const otp = url.searchParams.get('otp') as string;
	const redirectUrl = url.searchParams.get('redirect') as string;
	console.log('redirect url in auth callback', redirectUrl)	

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const session = await getSession();
			await supabase.auth.setSession({
				access_token: session.access_token,
				refresh_token: session.refresh_token
			});
			const { data: alertsData } = await supabase
				.from('user_alerts')
				.select()
				.returns<UserAlerts[]>();

			if (alertsData && alertsData.length === 0) {
				redirect(301, '/alerts/initial-setup');
			}
			if(redirectUrl){
				redirect(301, redirectUrl)
			}
			redirect(301, '/snow-report/resorts');
		}
	}
	if (otp) {
		const session = await getSession();
		await supabase.auth.setSession({
			access_token: session.access_token,
			refresh_token: session.refresh_token
		});
		const { data: alertsData } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>();
			
		if (alertsData && alertsData.length === 0) {
			redirect(301, '/alerts/initial-setup');
		}

		if(redirectUrl){
			redirect(301, redirectUrl)
		}
		redirect(301, '/snow-report/resorts');
	}

	// return the user to an error page with instructions
	redirect(303, '/auth/auth-code-error');
};

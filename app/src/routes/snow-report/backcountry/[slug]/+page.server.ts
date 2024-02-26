import type { BackcountryDetail, UserAlerts } from '$lib/supabase.types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals}) => {
	const { getSession, supabase } = locals;
	const session = await getSession();

	if(!session){
		const { data } = await supabase
			.from('backcountry_detail')
			.select()
			.eq('slug', params.slug)
			.returns<BackcountryDetail[]>()
			.single();

		if (data) {
			return {
				backcountryDetails: data,
				existingAlert: false
			};
		} else {
			error(404, 'Location not found');
		}
	} else {
		const { data } = await supabase
			.from('backcountry_detail')
			.select()
			.eq('slug', params.slug)
			.returns<BackcountryDetail[]>()
			.single();

		const { data: alertsData } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>();
	
		if (data && alertsData && alertsData.length) {
			const existingAlert = alertsData.find((alert) => alert.mountain_id === data.mountain_id)
			return {
				backcountryDetails: data,
				alertData: existingAlert,
				existingAlert: !!existingAlert,
				session
			};
		} else if (data && alertsData && !alertsData.length){
			return {
				backcountryDetails: data,
				existingAlert: false,
				session
			};
		} else {
			error(500, 'Something went wrong. Please try again.');
		}
	}
};

import type { ResortDetail, UserAlerts } from '$lib/supabase.types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { getSession, supabase } = locals;
	const session = await getSession();
	if(!session){
		const { data } = await supabase
			.from('resort_detail')
			.select()
			.eq('slug', params.slug)
			.returns<ResortDetail[]>()
			.single();

		if (data) {
			return {
				resortDetails: data,
				existingAlert: false
			};
		} else {
			error(404, 'Location not found');
		}
	} else {
		const { data } = await supabase
			.from('resort_detail')
			.select()
			.eq('slug', params.slug)
			.returns<ResortDetail[]>()
			.single();

		const { data: alertsData } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>();
	
		if (data && alertsData && alertsData.length) {
			const existingAlert = alertsData.find((alert) => alert.mountain_id === data.mountain_id)
			return {
				resortDetails: data,
				alertData: existingAlert,
				existingAlert: !!existingAlert,
				session
			};
		} else if (data && alertsData && !alertsData.length){
			return {
				resortDetails: data,
				existingAlert: false,
				session
			};
		} else {
			error(500, 'Something went wrong. Please try again.');
		}
	}
};

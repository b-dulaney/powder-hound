import {
	type MountainSnowfallForecast,
	type ResortDetail,
	type UserAlerts
} from '$lib/supabase.types';
import { constructSnowfallChartData } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dayjs from 'dayjs';

export const load: PageServerLoad = async ({ params, locals, depends }) => {
	depends('update:existingAlert');
	const { getSession, supabase } = locals;
	const session = await getSession();

	const { data: resortDetails } = await supabase
		.from('resort_detail')
		.select()
		.eq('slug', params.slug)
		.returns<ResortDetail[]>()
		.single();

	const { data: snowfallForecast } = await supabase
		.from('mountain_snowfall_forecast')
		.select()
		.eq('slug', params.slug)
		.returns<MountainSnowfallForecast[]>();

	const isResortClosed = resortDetails?.closing_date
		? dayjs().isAfter(dayjs(resortDetails.closing_date))
		: false;

	const snowfallChartData = snowfallForecast ? constructSnowfallChartData(snowfallForecast) : [];

	if (!resortDetails) {
		error(404, 'Location not found');
	}

	if (session) {
		const { data: alertsData } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>();

		const existingAlert = alertsData?.find(
			(alert) => alert.mountain_id === resortDetails.mountain_id
		);

		return {
			resortDetails,
			snowfallChartData,
			closed: isResortClosed,
			alertData: existingAlert,
			existingAlert: !!existingAlert,
			session
		};
	} else {
		return {
			resortDetails,
			snowfallChartData,
			closed: isResortClosed,
			existingAlert: false
		};
	}
};

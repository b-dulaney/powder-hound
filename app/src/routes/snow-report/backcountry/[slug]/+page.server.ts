import type {
	BackcountryDetail,
	MountainSnowfallForecast,
	MountainSnowfallHistorical,
	UserAlerts
} from '$lib/supabase.types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { constructSnowfallChartData } from '$lib/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { getSession, supabase } = locals;
	const session = await getSession();

	const { data: backcountryDetails } = await supabase
		.from('backcountry_detail')
		.select()
		.eq('slug', params.slug)
		.returns<BackcountryDetail[]>()
		.single();

	const { data: snowfallForecast } = await supabase
		.from('mountain_snowfall_forecast')
		.select()
		.eq('slug', params.slug)
		.returns<MountainSnowfallForecast[]>();

	const { data: snowfallHistorical } = await supabase
		.from('mountain_snowfall_historical')
		.select()
		.eq('slug', params.slug)
		.returns<MountainSnowfallHistorical[]>();

	const snowfallChartForecastData = snowfallForecast
		? constructSnowfallChartData(snowfallForecast)
		: [];

	const snowfallChartHistoricalData = snowfallHistorical
		? constructSnowfallChartData(snowfallHistorical)
		: [];

	if (!backcountryDetails) {
		error(404, 'Location not found');
	}

	if (session) {
		const { data: alertsData } = await supabase
			.from('user_alerts')
			.select()
			.returns<UserAlerts[]>();

		const existingAlert = alertsData?.find(
			(alert) => alert.mountain_id === backcountryDetails.mountain_id
		);

		return {
			backcountryDetails,
			snowfallChartForecastData,
			snowfallChartHistoricalData,
			alertData: existingAlert,
			existingAlert: !!existingAlert,
			session
		};
	} else {
		return {
			backcountryDetails,
			snowfallChartForecastData,
			snowfallChartHistoricalData,
			existingAlert: false
		};
	}
};

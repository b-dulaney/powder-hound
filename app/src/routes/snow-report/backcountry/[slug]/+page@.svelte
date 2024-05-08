<script lang="ts">
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import type { PageData } from './$types';

	import SnowForecastTabs from '$lib/components/snow-report/SnowForecastTabs.svelte';
	import SnowReportHeader from '$lib/components/snow-report/SnowReportHeader.svelte';
	import HourlyWeatherCard from '$lib/components/weather/HourlyWeatherCard.svelte';
	import WeatherForecastCard from '$lib/components/weather/WeatherForecastCard.svelte';
	import AvalancheDangerCard from './AvalancheDangerCard.svelte';
	import BackcountryWarningAlert from './BackcountryWarningAlert.svelte';
	export let data: PageData;

	const { backcountryDetails, snowfallChartForecastData, snowfallChartHistoricalData } = data;
	$: session = data.session as Session | null;
	$: existingAlert = data.existingAlert;
	$: alertData = data.alertData;
</script>

<svelte:head>
	<title>
		PowderHound | {backcountryDetails.display_name} Snow Report and Avalanche Forecast
	</title>
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content={`Get real-time snow reports, avalanche conditions, and accurate weather forecasts for ${backcountryDetails.display_name} | Stay informed with PowderHound`}
	/>
	<meta property="og:title" content="PowderHound | {backcountryDetails.display_name} Snow Report" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.toString()} />
	<meta
		property="og:image"
		content={`https://powderhound.io/og?title=${backcountryDetails.display_name} Snow Report`}
	/>
	<meta
		property="og:description"
		content={`Get real-time snow reports, avalanche conditions, and accurate weather forecasts for ${backcountryDetails.display_name} | Stay informed with PowderHound`}
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<div class="mx-auto w-full py-2">
	<section id="header-section">
		<SnowReportHeader
			{existingAlert}
			details={backcountryDetails}
			isResort={false}
			closed={false}
			{session}
			{alertData}
		/>
	</section>
</div>

<div class="py mx-auto w-full max-w-screen-xl pb-2">
	<div class="flex items-center justify-start">
		<BackcountryWarningAlert
			forecastUrl={backcountryDetails.forecast_url}
			displayName={backcountryDetails.display_name}
		/>
	</div>
</div>

<div class="mx-auto w-full max-w-screen-xl py-2">
	<section id="recent-and-upcoming-snowfall">
		<SnowForecastTabs
			snowNext24H={backcountryDetails.snow_next_24h}
			snowNext72H={backcountryDetails.snow_next_72h}
			snowfallChartData={snowfallChartForecastData}
			hourlySnowfall={backcountryDetails.next_24h_hourly_snowfall}
			snowPastWeek={backcountryDetails.snow_past_7d}
			snowfallHistoricalChartData={snowfallChartHistoricalData}
		/>
	</section>

	<section id="avalanche-and-weather-conditions" class="py-6 sm:pb-10">
		<div class="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:px-0">
			<div class="md:col-span-2">
				<AvalancheDangerCard {backcountryDetails} />
			</div>
			<WeatherForecastCard details={backcountryDetails} />
			<div class="hidden md:block">
				<HourlyWeatherCard details={backcountryDetails} />
			</div>
		</div>
	</section>
</div>

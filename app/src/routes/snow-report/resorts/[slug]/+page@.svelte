<script lang="ts">
	import { page } from '$app/stores';
	import AddRemoveAlertButton from '$lib/components/snow-report/AddRemoveAlertButton.svelte';
	import HourlyWeatherCard from '$lib/components/weather/HourlyWeatherCard.svelte';
	import SnowReportHeader from '$lib/components/snow-report/SnowReportHeader.svelte';
	import SnowForecastTabs from '$lib/components/snow-report/SnowForecastTabs.svelte';
	import type { Session } from '@supabase/supabase-js';
	import WeatherForecastCard from '$lib/components/weather/WeatherForecastCard.svelte';
	import type { PageData } from './$types';
	import ResortConditionsCard from './ResortConditionsCard.svelte';
	export let data: PageData;

	const { resortDetails, snowfallChartData, closed } = data;
	$: session = data.session as Session | undefined;
	$: existingAlert = data.existingAlert;
	$: alertData = data.alertData;
</script>

<svelte:head>
	<title>
		PowderHound | {resortDetails.display_name} Snow Report and Weather Forecast
	</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content={`Get real-time snow reports, mountain conditions, and accurate weather forecasts for ${resortDetails.display_name} | Stay informed with PowderHound`}
	/>
	<meta property="og:title" content="PowderHound | {resortDetails.display_name} Snow Report" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.toString()} />
	<meta
		property="og:image"
		content={`https://powderhound.io/og?title=${resortDetails.display_name} Snow Report`}
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content={`Get real-time snow reports, mountain conditions, and accurate weather forecasts for ${resortDetails.display_name} | Stay informed with PowderHound`}
	/>
</svelte:head>

<div class="mx-auto w-full">
	<section id="header-section">
		<SnowReportHeader
			details={resortDetails}
			snowReportHref="/snow-report/resorts"
			isResort
			{closed}
		/>
		<!-- <div class="py-2">
			<AddRemoveAlertButton {alertData} {existingAlert} details={resortDetails} {session} />
		</div> -->
	</section>
</div>

<div class="mx-auto w-full max-w-screen-2xl">
	<section id="upcoming-snowfall">
		<SnowForecastTabs
			snowNext24H={resortDetails.snow_next_24h}
			snowNext72H={resortDetails.snow_next_72h}
			{snowfallChartData}
			hourlySnowfall={resortDetails.next_24h_hourly_snowfall}
			snowPastWeek={null}
			snowfallHistoricalChartData={null}
		/>
	</section>
	<section id="mountain-and-weather-conditions" class="pb-6 sm:pb-10">
		<div class="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:px-0">
			<div class="md:col-span-2">
				<ResortConditionsCard {resortDetails} {closed} />
			</div>
			<WeatherForecastCard details={resortDetails} />

			<div class="hidden md:block">
				<HourlyWeatherCard details={resortDetails} />
			</div>
		</div>
	</section>
</div>

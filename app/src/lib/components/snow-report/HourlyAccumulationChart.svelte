<script lang="ts">
	import type { HourlySnowfall } from '$lib/supabase.types';
	import { Chart } from 'flowbite-svelte';
	import { getAccumulationChartConfig } from './chartConfig';

	export let hourlySnowfall: HourlySnowfall[];
	export let snowNext24H: number;

	const hourlyAccumulation = hourlySnowfall.map((d, i) => {
		return {
			datetime: d.datetime,
			accumulated_snowfall: hourlySnowfall
				.slice(0, i + 1)
				.reduce((acc, curr) => acc + curr.snowfall, 0)
		};
	});

	const next24hYDomain = snowNext24H > 6 ? snowNext24H : 6;

	const options = getAccumulationChartConfig(hourlyAccumulation, next24hYDomain);
</script>

<Chart {options} />

<style>
	:global(.dark .apexcharts-canvas .apexcharts-tooltip),
	:global(.dark .apexcharts-canvas .apexcharts-tooltip *) {
		color: white !important;
	}
</style>

<script lang="ts">
	import type { StackedChartData } from '$lib/supabase.types';
	import { Chart } from 'flowbite-svelte';
	import { getForecastChartConfig } from './chartConfig';
	export let chartData: StackedChartData[];
	export let yDomainMax: number;
	export let dateFormat: 'long' | 'short' = 'short';

	const options = getForecastChartConfig(chartData, yDomainMax, dateFormat);
</script>

<Chart {options} />

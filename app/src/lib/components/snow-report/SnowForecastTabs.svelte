<script lang="ts">
	import type { HourlySnowfall, StackedChartData } from '$lib/supabase.types';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import HourlyAccumulationChart from '$lib/components/snow-report/HourlyAccumulationChart.svelte';
	import SnowForecastChart from '$lib/components/snow-report/SnowForecastChart.svelte';
	import { Tabs, TabItem, Span, P } from 'flowbite-svelte';

	export let snowfallChartData: StackedChartData[];
	export let snowNext72H: number;
	export let snowNext24H: number;
	export let hourlySnowfall: HourlySnowfall[];
	export let snowPastWeek: number | null;
	export let snowfallHistoricalChartData: StackedChartData[] | null;

	const maxYValue = snowfallChartData.reduce((acc, curr) => {
		const max = Math.max(...curr.values.map((d) => d));
		return max > acc ? max : acc;
	}, 0);

	const maxYValueHistorical =
		snowfallHistoricalChartData !== null
			? snowfallHistoricalChartData.reduce((acc, curr) => {
					const max = Math.max(...curr.values.map((d) => d));
					return max > acc ? max : acc;
				}, 0)
			: 0;

	const next72hYDomain = maxYValue > 6.5 ? maxYValue : 6.5;
	const pastWeekYDomain = maxYValueHistorical > 6.6 ? maxYValueHistorical : 6.5;
</script>

<Tabs
	defaultClass="flex flex-wrap dark:bg-surface-900 bg-surface-100 border-surface-200 border dark:border-surface-700 rounded-t-lg"
	activeClasses="p-4 w-full group-first:rounded-tl-lg text-surface-900 bg-surface-50  dark:bg-surface-800 dark:text-white border-b-2 border-surface-600 dark:border-surface-100 -mb-[2px]"
	inactiveClasses="p-4 w-full group-first:rounded-tl-lg bg-surface-200/25 text-surface-500 dark:text-surface-400 hover:text-surface-700 hover:bg-surface-50  dark:hover:text-white dark:bg-surface-950 dark:hover:bg-surface-700"
	contentClass="p-4 bg-surface-50 dark:bg-surface-950 border-x border-b border-surface-200 rounded-b-lg dark:border-surface-700 min-h-[350px]"
>
	{#if snowPastWeek !== null}
		<TabItem open={snowPastWeek !== null} name="Snow Past Week">
			<svelte:fragment slot="title">
				<div class="flex flex-col items-start">
					<Span>Last 7 Days</Span>
					<Span class="text-xl font-bold tracking-normal">{snowPastWeek}"</Span>
				</div>
			</svelte:fragment>
			{#if snowPastWeek && snowfallHistoricalChartData !== null && snowPastWeek > 0}
				<div class="w-full">
					<SnowForecastChart
						dateFormat="short"
						chartData={snowfallHistoricalChartData}
						yDomainMax={pastWeekYDomain}
					/>
				</div>
			{:else}
				<div class="flex h-[300px] flex-col items-center justify-center">
					<p class="md:text-xl">No snowfall recorded 🌵</p>
				</div>
			{/if}
		</TabItem>
	{/if}
	<TabItem name="Snow Next 24 Hours" open={snowPastWeek === null}>
		<svelte:fragment slot="title">
			<div class="flex flex-col items-start">
				<Span>Next 24 Hours</Span>
				<Span class="text-xl font-bold tracking-normal">{snowNext24H}"</Span>
			</div>
		</svelte:fragment>
		{#if snowNext24H > 0}
			<HourlyAccumulationChart {hourlySnowfall} {snowNext24H} />
		{:else}
			<div class="flex h-[300px] flex-col items-center justify-center">
				<P class="md:text-xl">No snowfall predicted 🔮</P>
			</div>
		{/if}
	</TabItem>
	<TabItem name="Snow Next 72 Hours">
		<svelte:fragment slot="title">
			<div class="flex flex-col items-start">
				<Span>Next 72 Hours</Span>
				<Span class="text-xl font-bold tracking-normal">{snowNext72H}"</Span>
			</div>
		</svelte:fragment>
		{#if snowNext72H > 0}
			<div class="w-full">
				<SnowForecastChart
					chartData={snowfallChartData}
					dateFormat="long"
					yDomainMax={next72hYDomain}
				/>
			</div>
		{:else}
			<div class="flex h-[300px] flex-col items-center justify-center">
				<P class="md:text-xl">No snowfall predicted 🔮</P>
			</div>
		{/if}
	</TabItem>
</Tabs>

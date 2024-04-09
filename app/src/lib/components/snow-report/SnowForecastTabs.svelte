<script lang="ts">
	import type { HourlySnowfall, StackedChartData } from '$lib/supabase.types';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import HourlyAccumulationChart from '$lib/components/snow-report/HourlyAccumulationChart.svelte';
	import SnowForecastChart from '$lib/components/snow-report/SnowForecastChart.svelte';

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

	let tabSet: number = 0;
	if (snowPastWeek === null) {
		tabSet = 1;
	}
</script>

<TabGroup
	class="border-b border-b-surface-500 md:rounded-lg md:border md:border-surface-500"
	regionPanel="p-4"
	regionList="bg-surface-800 border-t border-t-surface-500 md:rounded-t-lg overflow-x-auto"
	active="!bg-surface-700 border-b-2 border-b-surface-50 !text-surface-50"
>
	{#if snowPastWeek !== null}
		<Tab
			bind:group={tabSet}
			name="tab2"
			value={0}
			class="min-w-[120px] !rounded-none border-r border-r-surface-500 bg-surface-900 text-start font-semibold tracking-tighter text-surface-300 md:min-w-[160px] md:pr-10"
		>
			<svelte:fragment slot="lead">Last 7 Days</svelte:fragment>
			<span class="text-xl font-bold tracking-normal">{snowPastWeek}"</span>
		</Tab>
	{/if}
	<Tab
		bind:group={tabSet}
		name="tab2"
		value={1}
		class="min-w-[120px] !rounded-none border-r border-r-surface-500 bg-surface-900 text-start font-semibold tracking-tighter text-surface-300 md:min-w-[160px] md:pr-10"
	>
		<svelte:fragment slot="lead">Next 24 Hours</svelte:fragment>
		<span class="text-xl font-bold tracking-normal">{snowNext24H}"</span>
	</Tab>
	<Tab
		bind:group={tabSet}
		name="tab1"
		class="min-w-[120px] !rounded-none border-r border-r-surface-500 bg-surface-900 text-start font-semibold tracking-tighter text-surface-300 md:min-w-[160px] md:pr-10"
		value={2}
	>
		<svelte:fragment slot="lead">Next 72 Hours</svelte:fragment>
		<span class="text-xl font-bold tracking-tighter">{snowNext72H}"</span>
	</Tab>

	<svelte:fragment slot="panel">
		<div class="p-4">
			{#if tabSet === 0 && snowfallHistoricalChartData !== null}
				{#if snowPastWeek && snowPastWeek > 0}
					<SnowForecastChart
						shortDates
						chartData={snowfallHistoricalChartData}
						yDomainMax={pastWeekYDomain}
					/>
				{:else}
					<div class="flex h-[150px] flex-col items-center justify-center">
						<p class="text-surface-300 md:text-xl">No snowfall recorded 🌵</p>
					</div>
				{/if}
			{:else if tabSet === 1}
				{#if snowNext24H > 0}
					<HourlyAccumulationChart {hourlySnowfall} {snowNext24H} />
				{:else}
					<div class="flex h-[150px] flex-col items-center justify-center">
						<p class="text-surface-300 md:text-xl">No snowfall predicted 🔮</p>
					</div>
				{/if}
			{:else if tabSet === 2}
				{#if snowNext72H > 0}
					<SnowForecastChart chartData={snowfallChartData} yDomainMax={next72hYDomain} />
				{:else}
					<div class="flex h-[150px] flex-col items-center justify-center">
						<p class="text-surface-300 md:text-xl">No snowfall predicted 🔮</p>
					</div>
				{/if}
			{/if}
		</div>
	</svelte:fragment>
</TabGroup>

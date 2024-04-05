<script lang="ts">
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import Card from '$lib/components/card.svelte';
	import SnowForecastChart from '$lib/components/snow-forecast-chart.svelte';
	import type { BackcountryDetail, StackedChartData } from '$lib/supabase.types';
	import { observeElement } from '$lib/utils';
	import { scaleTime } from 'd3-scale';
	import dayjs from 'dayjs';
	import {
		Area,
		Axis,
		Chart,
		ChartClipPath,
		LinearGradient,
		Svg,
		Tooltip,
		TooltipItem
	} from 'layerchart';
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	export let backcountryDetails: BackcountryDetail;
	export let snowfallChartForecastData: StackedChartData[];
	export let snowfallChartHistoricalData: StackedChartData[];

	let showAccumulation = false;

	onMount(async () => {
		showAccumulation = await observeElement('hourlyAccumulationCard');
	});

	const maxSnowfallPastWeek = Math.max(
		...backcountryDetails.previous_snowfall_totals.map((d) => d.snowfall_total)
	);
	const maxSnowfallNext72h = Math.max(
		...backcountryDetails.upcoming_snowfall_totals.map((d) => d.snowfall_total)
	);

	const pastWeekYDomain = maxSnowfallPastWeek > 6 ? maxSnowfallPastWeek : 6.5;
	const next72hYDomain = maxSnowfallNext72h > 6 ? maxSnowfallNext72h : 6.5;
	const next24hYDomain =
		backcountryDetails.snow_next_24h > 6 ? backcountryDetails.snow_next_24h : 6.5;

	const hourlyAccumulation = backcountryDetails.next_24h_hourly_snowfall.map((d, i) => {
		return {
			datetime: new Date(d.datetime),
			accumulated_snowfall: backcountryDetails.next_24h_hourly_snowfall
				.slice(0, i + 1)
				.reduce((acc, curr) => acc + curr.snowfall, 0)
				.toFixed(1)
		};
	});
</script>

<section id="avalanche-forecast">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4 lg:max-w-7xl">
		<div class="alert variant-ghost-primary">
			<div class="flex flex-col">
				<span class="flex items-center justify-start"
					><i class="fa-solid fa-circle-exclamation px-2" /><strong class="whitespace-nowrap"
						>Backcountry Forecasts</strong
					></span
				>
				<p>
					These forecasts are for use by experienced backcountry skiers and snowboarders. This
					summary is not a replacement for the detailed CAIC report. Make sure to read the full
					<a
						target="_blank"
						rel="noopener"
						class="anchor !text-surface-50"
						href={backcountryDetails.forecast_url}>{backcountryDetails.display_name} report</a
					>
					before heading out.
				</p>
			</div>
		</div>
		<Card>
			<svelte:fragment slot="header">Avalanche Danger</svelte:fragment>
			<svelte:fragment slot="header-subtitle"
				>Issued on: {backcountryDetails.issue_date}</svelte:fragment
			>
			<svelte:fragment slot="body">
				<div class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
					{#each backcountryDetails.danger_levels as { date, above_treeline, near_treeline, below_treeline }}
						<div id="avy-forecast-container" class="w-full">
							<h3 class="h4 py-2">{date}</h3>
							<div class="flex w-full flex-col">
								<div
									class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-400 bg-surface-600 p-2"
								>
									<p class="min-w-[105px] whitespace-nowrap text-sm md:text-base">Above Treeline</p>
									<p class="flex-grow text-center text-sm font-semibold md:text-base">
										{above_treeline.level} - {above_treeline.rating}
									</p>
									<span class="flex items-center justify-end"
										><AvalancheDangerIcon dangerLevel={above_treeline.level} size="40px" /></span
									>
								</div>
								<div
									class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-400 p-2"
								>
									<p class="min-w-[105px] whitespace-nowrap text-sm md:text-base">Near Treeline</p>
									<p class="flex-grow text-center text-sm font-semibold md:text-base">
										{near_treeline.level} - {near_treeline.rating}
									</p>
									<span class="flex items-center justify-end"
										><AvalancheDangerIcon dangerLevel={near_treeline.level} size="40px" /></span
									>
								</div>
								<div
									class="flex w-full items-center justify-between gap-0 rounded-sm border-b border-b-surface-400 bg-surface-600 p-2"
								>
									<p class="min-w-[105px] whitespace-nowrap text-sm md:text-base">Below Treeline</p>
									<p class="flex-grow text-center text-sm font-semibold md:text-base">
										{below_treeline.level} - {below_treeline.rating}
									</p>
									<span class="flex-shrink"
										><AvalancheDangerIcon dangerLevel={below_treeline.level} size="40px" /></span
									>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<p class="p-4">{@html backcountryDetails.avalanche_summary}</p>
			</svelte:fragment>
		</Card>
	</div>
</section>

<section id="recent-and-upcoming-snowfall">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4 lg:max-w-7xl">
		<Card>
			<svelte:fragment slot="header">Snow Report</svelte:fragment>
			<svelte:fragment slot="body">
				<div class="grid grid-cols-1 lg:grid-cols-2">
					<div class="my-6 flex w-full flex-col items-center">
						<p class="my-2 text-xl font-bold">Past Week</p>
						<div class="flex w-full items-center justify-center">
							<hr class="w-1/4 !border-slate-700 px-2" />
							<p class="px-6 text-xl">
								{backcountryDetails.snow_past_7d < 1 && backcountryDetails.snow_past_7d > 0
									? '< 1'
									: backcountryDetails.snow_past_7d}"
							</p>
							<hr class="w-1/4 !border-slate-700 px-2" />
						</div>
						<SnowForecastChart chartData={snowfallChartHistoricalData} yDomainMax={pastWeekYDomain} angleXAxis dimensions="h-[300px] w-[400px] md:w-[500px]" />
					</div>

					<div class="my-6 flex w-full flex-col items-center">
						<p class="my-2 text-xl font-bold">Next 72 Hours</p>
						<div class="flex w-full items-center justify-center">
							<hr class="w-1/4 !border-slate-700 px-2" />
							<p class="px-6 text-xl">
								{backcountryDetails.snow_next_72h < 1 && backcountryDetails.snow_next_72h > 0
									? '< 1'
									: backcountryDetails.snow_next_72h}"
							</p>
							<hr class="w-1/4 !border-slate-700 px-2" />
						</div>
						<SnowForecastChart chartData={snowfallChartForecastData} yDomainMax={next72hYDomain} dimensions="h-[300px] w-[400px] md:w-[500px]" />
					</div>
				</div>
			</svelte:fragment>
		</Card>

		{#if backcountryDetails.snow_next_24h >= 1}
			<div class="py-4">
				<Card>
					<svelte:fragment slot="header">Hourly Accumulation</svelte:fragment>
					<svelte:fragment slot="body">
						<div class="flex w-full items-center justify-center p-8">
							<div class="h-[300px] w-[400px] md:w-full" id="hourlyAccumulationCard">
								<Chart
									ssr
									data={hourlyAccumulation}
									x="datetime"
									xScale={scaleTime()}
									y="accumulated_snowfall"
									yDomain={[0, next24hYDomain]}
									padding={{ left: 24, bottom: 36 }}
									tooltip
								>
									<Svg>
										<Axis
											placement="left"
											grid
											rule
											labelProps={{
												class:
													'text-sm md:text-lg fill-surface-50 stroke-surface-50 stroke-width-0 font-semibold',
												dx: -12
											}}
											tickSize={0}
											format={(d) => `${d}"`}
										/>
										<Axis
											placement="bottom"
											format={(d) => dayjs(d).format('ha').slice(0, -1)}
											labelProps={{
												class:
													'text-xs md:text-lg fill-surface-50 stroke-surface-50 stroke-width-0 font-semibold',
												dy: 16
											}}
											rule
										/>
										{#if showAccumulation}
											<ChartClipPath
												initialWidth={0}
												tweened={{ width: { duration: 1000, easing: cubicInOut } }}
											>
												<LinearGradient
													class="from-secondary-500/90 to-secondary-500/10"
													vertical
													let:url
												>
													<Area line={{ class: 'stroke-2 stroke-secondary-500' }} fill={url} />
												</LinearGradient>
											</ChartClipPath>
										{/if}
									</Svg>

									<Tooltip header={(d) => dayjs(d.datetime).format('ddd ha')} let:data>
										<TooltipItem label="Accumulated snow" value={`${data.accumulated_snowfall}"`} />
									</Tooltip>
								</Chart>
							</div>
						</div>
					</svelte:fragment>
				</Card>
			</div>
		{/if}
	</div>
</section>

<style>
	p :global(a) {
		--tw-text-opacity: 1;
		color: rgb(var(--color-primary-500) / var(--tw-text-opacity));
		text-decoration-line: underline;
	}
	p :global(a:hover) {
		--tw-brightness: brightness(1.1);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
</style>

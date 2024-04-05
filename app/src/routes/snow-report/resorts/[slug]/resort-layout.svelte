<script lang="ts">

	import Card from '$lib/components/card.svelte';
	import type { ResortDetail, StackedChartData } from '$lib/supabase.types';
	import { observeElement, timeFromNow } from '$lib/utils';
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
	import SnowForecastChart from '../../../../lib/components/snow-forecast-chart.svelte';
	import OpenArc from './open-arc.svelte';
	import SnowDisplay from './snow-display.svelte';

	export let resortDetails: ResortDetail;
	export let snowfallChartData: StackedChartData[];

	let showAccumulation = false;

	onMount(async () => {
		showAccumulation = await observeElement('hourlyAccumulationCard');
	});

	const hourlyAccumulation = resortDetails.next_24h_hourly_snowfall.map((d, i) => {
		return {
			datetime: new Date(d.datetime),
			accumulated_snowfall: resortDetails.next_24h_hourly_snowfall
				.slice(0, i + 1)
				.reduce((acc, curr) => acc + curr.snowfall, 0)
				.toFixed(1)
		};
	});

	const next24hYDomain = resortDetails.snow_next_24h > 6 ? resortDetails.snow_next_24h : 6.5;
	const next72hYDomain = resortDetails.snow_next_72h > 6 ? resortDetails.snow_next_72h : 6.5;
</script>

{#if !resortDetails}
	<div class="placeholder-card h-[400px] w-full animate-pulse" />
{:else}
	<section id="mountain-info">
		<div class="mx-auto w-full max-w-7xl px-4 pt-4 lg:pt-6">
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card>
					<svelte:fragment slot="header">Mountain Conditions</svelte:fragment>
					<svelte:fragment slot="header-subtitle">
						Last update: {timeFromNow(resortDetails.updated_at)}
					</svelte:fragment>
					<svelte:fragment slot="body">
						<div class="grid grid-cols-2 items-center justify-center pt-4 p-6">
							{#if resortDetails?.snow_type}
								<div class="col-span-2 flex flex-col items-center">
									<p class="py-2 text-xl font-bold lg:text-2xl">{resortDetails?.snow_type}</p>
									<p class="font-semibold lg:text-xl">Overall Snowpack</p>
								</div>
							{/if}
							<SnowDisplay value={resortDetails.base_depth} type="Base Depth" />
							<SnowDisplay value={resortDetails.snow_past_24h} type="Last 24 Hours" />
							<SnowDisplay value={resortDetails.snow_past_48h} type="Last 48 Hours" />
							{#if resortDetails?.snow_past_week !== null && resortDetails?.snow_past_week >= 0}
								<SnowDisplay value={resortDetails?.snow_past_week} type="Last 7 Days" />
							{/if}
							{#if resortDetails?.snow_total !== null && resortDetails.snow_total >= 0}
								<SnowDisplay value={resortDetails?.snow_total} type="Season Total" />
							{/if}
							<div class="col-span-2 flex items-center">
								<OpenArc
								open={resortDetails?.lifts_open}
								total={resortDetails?.total_lifts}
								url={resortDetails.lifts_url}
								type="Lifts"
							/>
							<OpenArc
								open={resortDetails?.runs_open}
								total={resortDetails?.total_runs}
								url={resortDetails.trails_url}
								type="Runs"
							/>
							</div>

						</div>
					</svelte:fragment>
				</Card>
				<Card>
					<svelte:fragment slot="header">Snow Forecast</svelte:fragment>
					<svelte:fragment slot="body">
						<div class="grid grid-cols-1 items-center justify-center pt-4 p-6">
							<div class="my-2 flex w-full flex-col items-center">
								<p class="py-2 text-lg">Next 72 Hours</p>
								<div class="flex w-full items-center justify-center">
									<hr class="w-1/4 !border-slate-700 px-2" />
									<p class="px-6 text-lg font-bold">
										{resortDetails.snow_next_72h < 1 && resortDetails.snow_next_72h > 0
											? '< 1'
											: resortDetails.snow_next_72h}"
									</p>
									<hr class="w-1/4 !border-slate-700 px-2" />
								</div>
							</div>
				<SnowForecastChart chartData={snowfallChartData} yDomainMax={next72hYDomain} dimensions="h-[300px] w-[400px] md:w-[600px] md:h-[400px] lg:w-[400px] lg:h-[300px]" />
						</div>
					</svelte:fragment>
				</Card>
				{#if resortDetails.snow_next_24h >= 1}
					<div class="lg:col-span-2">
						<Card>
							<svelte:fragment slot="header">Hourly Accumulation</svelte:fragment>
							<svelte:fragment slot="body">
								<div class="flex w-full items-center justify-center p-8">
									<div class="h-[400px] w-[400px] md:w-full" id="hourlyAccumulationCard">
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
												<TooltipItem
													label="Accumulated snow"
													value={`${data.accumulated_snowfall}"`}
												/>
											</Tooltip>
										</Chart>
									</div>
								</div>
							</svelte:fragment>
						</Card>
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

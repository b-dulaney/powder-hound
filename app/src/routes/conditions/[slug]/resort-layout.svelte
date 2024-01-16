<script lang="ts">
	import type { MountainDetail, ResortConditions } from "$lib/supabase.types";
	import { formatDate } from "$lib/utils";
	import { scaleBand } from "d3-scale";
	import { Chart, Svg, Axis, Bars, Highlight, RectClipPath, Tooltip, TooltipItem } from "layerchart";
	import OpenArc from "./open-arc.svelte";
	import SnowDisplay from "./snow-display.svelte";
	import dayjs from "dayjs";

    export let mountainDetails: MountainDetail;
    export let resortConditions: ResortConditions;
</script>

{#if !resortConditions}
    <div class="placeholder-card w-full h-[400px] animate-pulse" />
{:else}
<section id="mountain-info">
	<div class="mx-auto w-full max-w-[90rem] px-4 pt-4 lg:pt-6">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div class="card mt-4 md:px-4 md:py-2">
				<div class="card-header">
					<h3 class="h3">Snow/Lift Conditions</h3>
					<p class="text-surface-400 py-2">Updated at: {dayjs(resortConditions?.updated_at).format('h:mm A')}</p>

				</div>
						<div class="grid items-center grid-cols-2 md:px-4 py-4">
							{#if resortConditions?.snow_type}
								<div class="col-span-2 flex flex-col items-center">
									<p class="py-2 font-bold text-xl lg:text-2xl">{resortConditions?.snow_type}</p>
									<p class="font-semibold lg:text-xl">Overall Snowpack</p>
								</div>
							{/if}
							<SnowDisplay value={resortConditions.base_depth} type="Base Depth" />
							<SnowDisplay value={resortConditions.snow_past_24h} type="Last 24 Hours" />
							<SnowDisplay value={resortConditions.snow_past_48h} type="Last 48 Hours" />
							{#if resortConditions?.snow_past_week}
								<SnowDisplay value={resortConditions.snow_past_week} type="Last 7 Days" />
							{/if}
							{#if resortConditions?.snow_total}
								<SnowDisplay value={resortConditions?.snow_total} type="Season Total" />
							{/if}
							<OpenArc open={resortConditions?.lifts_open} total={resortConditions?.total_lifts} type="Lifts" />
							<OpenArc open={resortConditions?.runs_open} total={resortConditions?.total_runs} type="Runs" />
						</div>
					</div>
				<div class="card mt-4 md:px-4 md:py-2">
					<div class="card-header">
						<h3 class="h3">Upcoming Snowfall</h3>
					</div>
					<div class="flex flex-col h-5/6 items-center justify-evenly mt-6">
						<div class="my-4 flex w-full flex-col items-center">
							<p class="py-2 text-xl">Next 72 Hours</p>
							<div class="flex w-full items-center justify-center">
								<hr class="w-1/4 !border-slate-700 px-2" />
								<p class="px-6 text-xl font-bold">
									{mountainDetails.next72hoursnowfall < 1 && mountainDetails.next72hoursnowfall > 0
										? '< 1'
										: mountainDetails.next72hoursnowfall}"
								</p>
								<hr class="w-1/4 !border-slate-700 px-2" />
							</div>
						</div>
						<div class="flex justify-center items-center w-full px-6 py-6">
							<div class="h-[400px] w-[400px]">
								<Chart
								ssr
								data={mountainDetails.upcoming_snowfall_totals}
								x="date"
								xScale={scaleBand().domain(mountainDetails.upcoming_snowfall_totals.map((d) => d.date)).paddingInner(0.2).paddingOuter(0.3)}
								y="snowfall_total"
								yDomain={[0, null]}
								yNice
								padding={{ left: 24, bottom: 36 }}
								tooltip={{ mode: "band" }}
							  >
								<Svg>
								  <Axis placement="left" rule labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-100 stroke-surface-100 font-light", dx: -15}} tickSize={10} format={(d) => `${d}''`}
								  />
								  <Axis
									placement="bottom"
									labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-100 stroke-surface-100", dy: 20,}}
									tickSize={0}
									format={(d) => formatDate(d)}
								  />
								  <Bars radius={8} strokeWidth={2} class="fill-primary-500 stroke-primary-400 transition-colors opacity-50" />
								  <Highlight area>
									<svelte:fragment slot="area" let:area>
									  <RectClipPath
										x={area.x}
										y={area.y}
										width={area.width}
										height={area.height}
										spring
									  >
										<Bars radius={8} strokeWidth={2} class="fill-primary-500 stroke-primary-400 opacity-100" />
									  </RectClipPath>
									</svelte:fragment>
								  </Highlight>
								</Svg>
								
								<Tooltip header={(data) => dayjs(data.date).format('MMM DD YYYY')} let:data>
									<TooltipItem label="Snowfall (in)" value={data.snowfall_total} />
								  </Tooltip>
							  </Chart>
							  </div>
							  </div>
					</div>

				</div>
		</div>
	</div>
</section>
{/if}

<script lang="ts">
	import type { MountainDetail, ResortConditions } from "$lib/supabase.types";
	import { formatDate } from "$lib/utils";
	import { scaleBand } from "d3-scale";
	import { Chart, Svg, Axis, Bars, Highlight, RectClipPath, Tooltip, TooltipItem } from "layerchart";
	import OpenArc from "./open-arc.svelte";
	import SnowDisplay from "./snow-display.svelte";

    export let mountainDetails: MountainDetail;
    export let resortConditions: ResortConditions;
    export let gridCols: number;
</script>

<section id="mountain-info">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4 lg:pt-8">
		<div class="grid grid-cols-1 gap-4">
			<div class="card mt-4 w-full md:px-4 md:py-2 xl:px-6 xl:py-3">
				<div class="flex h-full flex-col justify-around">
					<div class="card-header">
						<h3 class="h3">Snow/Lift Conditions</h3>
						<div class="grid items-center grid-cols-2 lg:grid-cols-{gridCols} py-2">
							{#if resortConditions?.snow_type}
								<div class="col-span-2 lg:col-span-{gridCols} flex flex-col py-4">
									<p class="font-semibold lg:text-xl">Overall Snowpack</p>
									<p class="font-bold text-xl lg:text-2xl">{resortConditions?.snow_type}</p>
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
						</div>
						<div class="grid items-center grid-cols-2 py-2">
							<OpenArc open={resortConditions?.lifts_open} total={resortConditions?.total_lifts} type="Lifts" />
							<OpenArc open={resortConditions?.runs_open} total={resortConditions?.total_runs} type="Runs" />
						</div>
					</div>
			</div>
		</div>
	</div>
</section>

<section id="upcoming-snowfall">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4">
		<div class="grid grid-cols-1 gap-8">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Upcoming Snowfall</h3>
				</div>

				<div class="my-4 flex w-full flex-col items-center">
					<p class="my-2 text-xl font-bold">Next 72 Hours</p>
					<div class="flex w-full items-center justify-center">
						<hr class="w-1/4 !border-slate-700 px-2" />
						<p class="px-6 text-xl">
							{mountainDetails.next72hoursnowfall < 1 && mountainDetails.next72hoursnowfall > 0
								? '< 1'
								: mountainDetails.next72hoursnowfall}"
						</p>
						<hr class="w-1/4 !border-slate-700 px-2" />
					</div>
				</div>
				<div class="h-[400px] p-6 w-full">
					<Chart
					data={mountainDetails.upcoming_snowfall_totals}
					x="date"
					xScale={scaleBand().padding(0.5)}
					y="snowfall_total"
					yDomain={[0, null]}
					yNice
					padding={{ left: 24, bottom: 36 }}
					tooltip={{ mode: "band" }}
				  >
					<Svg>
					  <Axis placement="left" rule labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-300 stroke-surface-300 font-light", dx: -15}} tickSize={10} format={(d) => `${d}''`}
					  />
					  <Axis
						placement="bottom"
						labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-300 stroke-surface-300", dy: 20,}}
						tickSize={0}
						format={(d) => formatDate(d)}
					  />
					  <Bars radius={8} strokeWidth={2} class="fill-tertiary-500 stroke-tertiary-300 transition-colors opacity-50" />
					  <Highlight area>
						<svelte:fragment slot="area" let:area>
						  <RectClipPath
							x={area.x}
							y={area.y}
							width={area.width}
							height={area.height}
							spring
						  >
							<Bars radius={8} strokeWidth={2} class="fill-tertiary-400 stroke-tertiary-300 opacity-100" />
						  </RectClipPath>
						</svelte:fragment>
					  </Highlight>
					</Svg>
					
					<Tooltip header={(data) => data.date} let:data>
						<TooltipItem label="Snowfall (in)" value={data.snowfall_total} />
					  </Tooltip>
				  </Chart>
				  </div>
				  
			</div>
		</div>
	</div>
</section>
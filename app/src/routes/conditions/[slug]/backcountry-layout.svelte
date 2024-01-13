<script lang="ts">
	import type { MountainDetail } from "$lib/supabase.types";
	import { formatDate } from "$lib/utils";
	import { scaleBand } from "d3-scale";
	import { Chart, Svg, Axis, Bars, Highlight, RectClipPath, Tooltip, TooltipItem } from "layerchart";

    export let mountainDetails: MountainDetail;
</script>

<section id="recent-and-upcoming-snowfall">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4">
		<div class="grid grid-cols-1 gap-8">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Snow Report</h3>
				</div>

				<div class="my-6 flex w-full flex-col items-center">
					<p class="my-2 text-xl font-bold">Past Week</p>
					<div class="flex w-full items-center justify-center">
						<hr class="w-1/4 !border-slate-700 px-2" />
						<p class="px-6 text-xl">
							{mountainDetails.past7daysnowfall < 1 && mountainDetails.past7daysnowfall > 0
								? '< 1'
								: mountainDetails.past7daysnowfall}"
						</p>
						<hr class="w-1/4 !border-slate-700 px-2" />
					</div>
				</div>

				<div class="h-[400px] px-6 py-8 w-full">
					<Chart
					data={mountainDetails.previous_snowfall_totals}
					x="date"
					xScale={scaleBand().padding(0.4)}
					y="snowfall_total"
					yDomain={[0, 18]}
					yNice
					padding={{ left: 24, bottom: 36 }}
					tooltip={{ mode: "band" }}
				  >
					<Svg>
					  <Axis placement="left" rule labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-300 stroke-surface-300 font-light", dx: -15}} tickSize={10} format={(d) => `${d}''`}
					  />
					  <Axis
						placement="bottom"
						labelProps={{rotate: 315,
							textAnchor: "end",
							class: "text-sm md:text-lg tracking-widest fill-surface-300 stroke-surface-300", dy: 20,}}
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

				<div class="my-6 flex w-full flex-col items-center">
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
				<div class="h-[400px] px-6 py-8 w-full">
					<Chart
					data={mountainDetails.upcoming_snowfall_totals}
					x="date"
					xScale={scaleBand().padding(0.4)}
					y="snowfall_total"
					yDomain={[0, 18]}
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
<script lang="ts">
	import type { MountainDetail } from "$lib/supabase.types";
	import { formatDate } from "$lib/utils";
	import { scaleBand } from "d3-scale";
	import dayjs from "dayjs";
	import { Chart, Svg, Axis, Bars, Highlight, RectClipPath, Tooltip, TooltipItem } from "layerchart";

    export let mountainDetails: MountainDetail;
</script>

<section id="recent-and-upcoming-snowfall">
	<div class="mx-auto w-full max-w-6xl lg:max-w-[90rem] px-4 pt-4">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Snow Report</h3>
				</div>
				<div class="grid grid-cols-1 lg:grid-cols-2">
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
					<div class="flex justify-center items-center w-full px-6 py-8">
						<div class="h-[400px]  w-[400px]">
							<Chart
							ssr
							data={mountainDetails.previous_snowfall_totals}
							x="date"
							xScale={scaleBand().domain(mountainDetails.upcoming_snowfall_totals.map((d) => d.date)).paddingInner(0.2).paddingOuter(0.3)}
							y="snowfall_total"
							yDomain={[0, 18]}
							yNice
							padding={{ left: 24, bottom: 36 }}
							tooltip={{ mode: "band" }}
						  >
							<Svg>
							  <Axis placement="left" rule labelProps={{class: "text-sm md:text-lg tracking-widest fill-surface-100 stroke-surface-100", dx: -15}} tickSize={10} format={(d) => `${d}''`}
							  />
							  <Axis
								placement="bottom"
								labelProps={{rotate: 315,
									textAnchor: "end",
									class: "text-sm md:text-lg tracking-widest fill-surface-100 stroke-surface-100", dy: 20,}}
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
					<div class="flex justify-center items-center w-full px-6 py-8">
						<div class="h-[400px] w-[400px]">
							<Chart
							ssr
							data={mountainDetails.upcoming_snowfall_totals}
							x="date"
							xScale={scaleBand().domain(mountainDetails.upcoming_snowfall_totals.map((d) => d.date)).paddingInner(0.2).paddingOuter(0.3)}
							y="snowfall_total"
							yDomain={[0, 18]}
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
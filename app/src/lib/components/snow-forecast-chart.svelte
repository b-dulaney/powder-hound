<script lang="ts">
	import type { StackedChartData } from '$lib/supabase.types';
	import { formatDate } from '$lib/utils';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import dayjs from 'dayjs';
	import { Axis, Bars, Chart, Highlight, Svg, Tooltip, TooltipItem } from 'layerchart';
	export let chartData: StackedChartData[];
	export let yDomainMax: number;
	export let dimensions: string;
	export let angleXAxis: boolean = false;
</script>

<div class="flex w-full items-center justify-center gap-4 pt-4">
	<span class="inline-flex items-center"
		><div class="mx-2 h-4 w-4 rounded bg-primary-500" />
		 Day</span
	>
	<span class="inline-flex items-center"
		><div class="mx-2 h-4 w-4 rounded bg-secondary-500" />
		 Night</span
	>
</div>
<div class="flex w-full items-center justify-center p-6 pt-4">
	<div class={dimensions}>
		<Chart
			ssr
			data={chartData}
			x="day"
			xScale={scaleBand().paddingInner(0.3).paddingOuter(0.1)}
			y="values"
			yDomain={[0, yDomainMax]}
			yNice
			r={(d) => d.keys[1]}
			rDomain={['daytime_snowfall', 'nighttime_snowfall']}
			rRange={['rgba(var(--color-primary-500))', 'rgba(var(--color-secondary-500))']}
			rScale={scaleOrdinal()}
			padding={{ left: 24, bottom: 36 }}
			tooltip={{ mode: 'band' }}
		>
			<Svg>
				<Axis
					placement="left"
					rule
					grid
					labelProps={{
						class:
							'text-sm md:text-lg fill-surface-50 stroke-surface-50 stroke-width-0 font-semibold',
						dx: -12
					}}
					tickSize={0}
					format={(d) => `${d}"`}
				/>
				{#if angleXAxis}
					<Axis
						placement="bottom"
						labelProps={{
							rotate: 315,
							textAnchor: 'end',
							class:
								'text-sm md:text-lg fill-surface-50 stroke-surface-50 stroke-width-0 font-semibold',
							dy: 12
						}}
						tickSize={0}
						format={(d) => formatDate(d)}
					/>
				{:else}
					<Axis
						placement="bottom"
						labelProps={{
							class:
								'text-sm md:text-lg fill-surface-50 stroke-surface-50 stroke-width-0 font-semibold',
							dy: 12
						}}
						tickSize={0}
						format={(d) => formatDate(d)}
					/>
				{/if}
				<Bars radius={4} strokeWidth={1} groupBy="time" class="stroke-surface-900" />
				<Highlight area />
			</Svg>

			<Tooltip header={(data) => dayjs(data.day).format('ddd, MMM DD')} let:data>
				<TooltipItem label="Day" value={`${Math.round(data.daytimeSnowfall * 10) / 10}"`} />
				<TooltipItem label="Night" value={`${Math.round(data.nighttimeSnowfall * 10) / 10}"`} />
				<TooltipItem
					label="Total"
					value={`${Math.round((data.daytimeSnowfall + data.nighttimeSnowfall) * 10) / 10}"`}
				/>
			</Tooltip>
		</Chart>
	</div>
</div>

<script lang="ts">

	import type { HourlySnowfall } from '$lib/supabase.types';
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
	import { cubicInOut } from 'svelte/easing';

	export let hourlySnowfall: HourlySnowfall[];
    export let snowNext24H: number;

	const hourlyAccumulation = hourlySnowfall.map((d, i) => {
		return {
			datetime: new Date(d.datetime),
			accumulated_snowfall: hourlySnowfall
				.slice(0, i + 1)
				.reduce((acc, curr) => acc + curr.snowfall, 0)
				.toFixed(1)
		};
	});

	const next24hYDomain = snowNext24H > 6.5 ? snowNext24H : 6.5;
</script>

<div class="h-[300px] w-full" id="hourlyAccumulationCard">
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
				grid={{style: 'stroke: rgba(var(--color-surface-500))'}}
				labelProps={{
					class:
						'text-sm md:text-lg fill-surface-400 font-semibold',
					dx: -10,
					style: 'stroke-width: 0'
				}}
				tickSize={0}
				format={(d) => `${d}"`}
			/>
			<Axis
				placement="bottom"
				format={(d) => dayjs(d).format('ha').slice(0, -1)}
				labelProps={{
					class:
						'text-xs md:text-lg fill-surface-400 font-semibold',
					dy: 16,
					style: 'stroke-width: 0'
				}}
			/>
				<ChartClipPath
					initialWidth={0}
					tweened={{ width: { duration: 400, easing: cubicInOut } }}
				>
					<LinearGradient
						class="from-secondary-500/90 to-secondary-500/10"
						vertical
						let:url
					>
						<Area line={{ class: 'stroke-2 stroke-secondary-500' }} fill={url} />
					</LinearGradient>
				</ChartClipPath>
		</Svg>

		<Tooltip header={(d) => dayjs(d.datetime).format('ddd ha')} let:data>
			<TooltipItem
				label="Accumulated snow"
				value={`${data.accumulated_snowfall}"`}
			/>
		</Tooltip>
	</Chart>
</div>
<div class="flex w-full items-center justify-center gap-4 text-surface-400">
	<span class="inline-flex items-center"><div class="w-4 h-4 border-2 border-solid border-secondary-500 bg-secondary-500/20 rounded mx-2" /> Snow Accumulation</span>
</div>


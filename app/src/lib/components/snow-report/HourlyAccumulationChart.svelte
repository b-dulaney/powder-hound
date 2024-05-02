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
				grid={{ style: 'stroke: rgba(var(--color-surface-300))' }}
				labelProps={{
					class: 'text-sm md:text-lg fill-surface-900 dark:fill-surface-300 font-medium',
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
					class: 'text-xs md:text-lg fill-surface-900 dark:fill-surface-300 font-medium',
					dy: 16,
					style: 'stroke-width: 0'
				}}
			/>
			<ChartClipPath initialWidth={0} tweened={{ width: { duration: 400, easing: cubicInOut } }}>
				<LinearGradient class="from-primary-500/80 to-primary-500/60" vertical let:url>
					<Area line={{ class: 'stroke-2 stroke-primary-800' }} fill={url} />
				</LinearGradient>
			</ChartClipPath>
		</Svg>

		<Tooltip header={(d) => dayjs(d.datetime).format('ddd ha')} let:data>
			<TooltipItem label="Accumulated snow" value={`${data.accumulated_snowfall}"`} />
		</Tooltip>
	</Chart>
</div>
<div class="flex w-full items-center justify-center gap-4 text-surface-500 dark:text-surface-300">
	<span class="inline-flex items-center"
		><div class="mx-2 h-4 w-4 rounded border-2 border-solid border-primary-500 bg-primary-500/20" />
		Snow Accumulation</span
	>
</div>

<script lang="ts">
	import type { StackedChartData } from '$lib/supabase.types';
	import { formatDate } from '$lib/utils';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import dayjs from 'dayjs';
	import {
		Axis,
		Bars,
		Chart,
		Highlight,
		RectClipPath,
		Svg,
		Tooltip,
		TooltipItem
	} from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	export let chartData: StackedChartData[];
	export let yDomainMax: number;
	export let shortDates: boolean = false;
	import { onMount } from 'svelte';
	let padding = 0.2;
	let windowWidth: number;

	onMount(() => {
		windowWidth = window.innerWidth;

		window.addEventListener('resize', () => {
			windowWidth = window.innerWidth;
		});

	})
	
	$: padding = windowWidth > 640 ? 0.6 : 0.2;


</script>


<div class="flex w-full h-[300px] items-center justify-center">
		<Chart
			ssr
			data={chartData}
			x="day"
			xScale={scaleBand().padding(padding)}
			y="values"
			yDomain={[0, yDomainMax]}
			yNice
			r={(d) => d.keys[1]}
			rDomain={['daytime_snowfall', 'nighttime_snowfall']}
			rRange={['rgba(var(--color-primary-700))', 'rgba(var(--color-secondary-700))']}
			rScale={scaleOrdinal()}
			padding={{ left: 24, bottom: 36 }}
			tooltip={{ mode: 'band' }}
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
				{#if shortDates}
					<Axis
						placement="bottom"
						labelProps={{
							class:
								'text-sm md:text-lg fill-surface-400 font-semibold',
							style: 'stroke-width: 0',
							dy: 12
						}}
						tickSize={0}
						format={(d) => formatDate(d, "short")}
					/>
				{:else}
					<Axis
						placement="bottom"
						labelProps={{
							class:
								'text-sm md:text-lg fill-surface-400 font-semibold',
							dy: 12,
							style: 'stroke-width: 0'
						}}
						tickSize={0}
						format={(d) => formatDate(d, "long")}
					/>
				{/if}
				<Bars initialY={350 - 24 * 2 - 2 - 36}
				initialHeight={0} radius={2} strokeWidth={2} groupBy="time" class="odd:stroke-primary-500 even:stroke-secondary-500"  style='fill-opacity: 0.6; stroke-opacity: 1'
				tweened={{
					y: { duration: 500, easing: cubicInOut },
					height: { duration: 500, easing: cubicInOut },
					}} />
				<Highlight area>
					<svelte:fragment slot="area" let:area>
						<RectClipPath
						x={area.x}
						y={area.y}
						width={area.width}
						height={area.height}
						spring
						>
						<Bars radius={2} groupBy="time" strokeWidth={2} class="odd:fill-primary-500 even:fill-secondary-500 odd:stroke-primary-400 even:stroke-secondary-400"/>
						</RectClipPath>
					</svelte:fragment>
					</Highlight>
			</Svg>

			<Tooltip header={(data) => dayjs(data.day).format('ddd, MMM DD')} let:data>
				<TooltipItem label="Day" value={`${Math.round(data.daytimeSnowfall  * 10) / 10}"`} />
				<TooltipItem label="Night" value={`${Math.round(data.nighttimeSnowfall  * 10) / 10}"`} />
				<TooltipItem label="Total" value={`${Math.round((data.daytimeSnowfall + data.nighttimeSnowfall) * 10) / 10}"`} />
			</Tooltip>
		</Chart>
</div>
	<div class="flex w-full items-center justify-center gap-4 text-surface-400">
		<span class="inline-flex items-center"><div class="w-4 h-4 border-2 border-solid border-primary-500 bg-primary-500/60 rounded mx-2" /> Day</span>
		<span class="inline-flex items-center"><div class="w-4 h-4 border-2 border-solid border-secondary-500 bg-secondary-500/60 rounded mx-2" /> Night</span>
</div>


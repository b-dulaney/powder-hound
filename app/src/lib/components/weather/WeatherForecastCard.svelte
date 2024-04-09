<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import WeatherForecastSlice from '$lib/components/weather/WeatherForecastSlice.svelte';
	import HourlyForecastList from '$lib/components/weather/HourlyForecastList.svelte';
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { weatherConditionsMap } from '$lib/utils';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	export let details: ResortDetail | BackcountryDetail;
</script>

<Card>
	<svelte:fragment slot="header">Weather Forecast</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="flex h-full flex-col lg:justify-evenly">
			<div class="flex justify-between py-4 sm:w-2/3 sm:self-center">
				<div class="flex flex-col p-4">
					<p class="text-3xl font-bold">{details.current_temp}°</p>
					<p class="text-xl font-semibold">
						{weatherConditionsMap[details.current_weather]}
					</p>
					<div class="flex">
						<p>
							High {details.temperature_range[1].high_temp}&deg;
						</p>
						<p class=" mx-2">&middot;</p>
						<p>
							Low {details.temperature_range[1].low_temp}&deg;
						</p>
					</div>
				</div>
				<div class="flex flex-col items-center justify-center p-8">
					<WeatherIcon weatherDesc={details.current_weather} size="large" />
				</div>
			</div>
			<div
				class="flex w-full items-center justify-between px-4 py-2 md:self-center md:py-6 xl:w-11/12"
			>
				{#each details.temperature_range as { date, low_temp, high_temp, snowfall }, i (i)}
					<WeatherForecastSlice
						{high_temp}
						{low_temp}
						weatherDesc={details.daily_weather_conditions[i].daily_weather}
						{date}
					/>
					{#if i < details.temperature_range.length - 1}
						<hr class="divider-vertical h-20" />
					{/if}
				{/each}
			</div>

			<Accordion class="py-4 lg:hidden">
				<AccordionItem>
					<svelte:fragment slot="summary"
						><p class="!rounded-none text-center">View Hourly Forecast</p></svelte:fragment
					>
					<svelte:fragment slot="content">
						<HourlyForecastList {details} />
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	</svelte:fragment>
</Card>

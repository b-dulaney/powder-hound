<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import WeatherForecastSlice from '$lib/components/weather/WeatherForecastSlice.svelte';
	import HourlyForecastList from '$lib/components/weather/HourlyForecastList.svelte';
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { weatherConditionsMap } from '$lib/utils';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { P } from 'flowbite-svelte';
	export let details: ResortDetail | BackcountryDetail;
</script>

<Card>
	<svelte:fragment slot="header">Weather Forecast</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="flex h-full w-full flex-col md:justify-evenly">
			<div class="flex justify-between p-4 sm:p-6">
				<div class="flex flex-col p-4">
					<P class="text-3xl font-bold">{details.current_temp}°</P>
					<P class="text-xl font-semibold">
						{weatherConditionsMap[details.current_weather]}
					</P>
					<div class="flex">
						<P>
							High {details.temperature_range[1].high_temp}&deg;
						</P>
						<P class=" mx-2">&middot;</P>
						<P>
							Low {details.temperature_range[1].low_temp}&deg;
						</P>
					</div>
				</div>
				<div class="flex flex-col items-center justify-center p-8">
					<WeatherIcon weatherDesc={details.current_weather} size="large" />
				</div>
			</div>
			<div class="flex w-full items-center justify-between p-4 sm:p-6">
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

			<Accordion class="py-4 md:hidden">
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

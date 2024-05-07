<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import WeatherForecastSlice from '$lib/components/weather/WeatherForecastSlice.svelte';
	import HourlyForecastList from '$lib/components/weather/HourlyForecastList.svelte';
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { weatherConditionsMap } from '$lib/utils';
	import { Accordion, AccordionItem, Span } from 'flowbite-svelte';
	import { P } from 'flowbite-svelte';
	export let details: ResortDetail | BackcountryDetail;
</script>

<Card>
	<svelte:fragment slot="header">Weather Forecast</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="flex h-full w-full flex-col md:justify-around">
			<div class="flex justify-between p-4 sm:p-6 md:justify-center">
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
			<div class="mx-auto grid w-full grid-cols-5 items-center divide-x dark:divide-surface-700">
				{#each details.temperature_range as { date, low_temp, high_temp, snowfall }, i (i)}
					<WeatherForecastSlice
						{high_temp}
						{low_temp}
						weatherDesc={details.daily_weather_conditions[i].daily_weather}
						{date}
					/>
				{/each}
			</div>

			<Accordion flush class="px-6 py-2 md:hidden">
				<AccordionItem borderBottomClass="border-0">
					<Span slot="header">View Hourly Forecast</Span>
					<HourlyForecastList {details} />
				</AccordionItem>
			</Accordion>
		</div>
	</svelte:fragment>
</Card>

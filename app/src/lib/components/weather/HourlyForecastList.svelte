<script lang="ts">
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { convertWindDirection, convertWindSpeed } from '$lib/utils';
	import { P, Span } from 'flowbite-svelte';
	export let details: ResortDetail | BackcountryDetail;
</script>

<ul class="md:px-2 lg:px-4">
	{#each details.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
		<li class="!rounded-md">
			<div class="grid w-full grid-cols-6 items-center gap-3 py-2">
				<P class="text-xs text-surface-500 lg:text-sm">
					{new Date(datetime).toLocaleTimeString('en-US', {
						hour: 'numeric',
						hour12: true,
						timeZone: 'America/Denver'
					})}
				</P>
				<WeatherIcon datetime={new Date(datetime)} weatherDesc={weather_desc} size="small" />
				{#if snowfall > 0}
					<P class="text-xs font-semibold lg:text-sm">{snowfall}"</P>
				{:else}
					<P class="text-start text-xs lg:text-sm">--</P>
				{/if}
				<P class="text-xs lg:text-sm">{temp}&deg;</P>
				<Span class="col-span-2">
					<div class="flex justify-evenly">
						<P class="text-xs lg:text-sm">
							{convertWindSpeed(wind_deg_speed)}
						</P>
						<P class="text-xs lg:text-sm">
							<i
								class="fa-solid fa-location-arrow text-primary-500"
								style="transform: rotate({parseInt(wind_deg_speed.split('/')[0], 10) + 140}deg);"
							></i>&nbsp;
							{convertWindDirection(wind_deg_speed)}
						</P>
					</div>
				</Span>
			</div>
		</li>
		<hr class="mt-1 opacity-60 last:hidden dark:opacity-20" aria-hidden />
	{/each}
</ul>

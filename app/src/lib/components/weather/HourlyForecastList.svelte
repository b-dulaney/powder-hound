<script lang="ts">
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { convertWindDirection, convertWindSpeed } from '$lib/utils';
	export let details: ResortDetail|BackcountryDetail;
</script>

<ul class="list">
    {#each details.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
        <li class="!rounded-md">
            <div class="grid w-full grid-cols-6 items-center gap-3 py-2">
                <p class="text-xs text-surface-400 sm:text-sm">
                    {new Date(datetime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true,
                        timeZone: 'America/Denver'
                    })}
                </p>
                <WeatherIcon
                    datetime={new Date(datetime)}
                    weatherDesc={weather_desc}
                    size="small"
                />
                {#if snowfall > 0}
                    <p class="text-sm font-semibold">{snowfall}"</p>
                {:else}
                    <p class="text-start text-sm">--</p>
                {/if}
                <p class="text-sm">{temp}&deg;</p>
                <span class="col-span-2">
                    <div class="flex justify-evenly">
                        <p class="text-xs sm:text-sm">
                            {convertWindSpeed(wind_deg_speed)}
                        </p>
                        <p class="text-xs sm:text-sm">
                            <i
                                class="fa-solid fa-location-arrow text-primary-500"
                                style="transform: rotate({parseInt(
                                    wind_deg_speed.split('/')[0],
                                    10
                                ) + 140}deg);"
                            ></i>&nbsp;
                            {convertWindDirection(wind_deg_speed)}
                        </p>
                    </div>
                </span>
            </div>
        </li>
        <hr class="mt-1 opacity-60 last:hidden" aria-hidden />
    {/each}
</ul>


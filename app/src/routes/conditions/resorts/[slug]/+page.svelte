<script lang="ts">
	import WeatherForecastSlice from '$lib/components/weather-forecast-slice.svelte';
	import WeatherIcon from '$lib/components/weather-icon.svelte';
	import { convertWindDirection, convertWindSpeed, weatherConditionsMap } from '$lib/utils';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import ResortLayout from './resort-layout.svelte';
	export let data: PageData;

	const { resortDetails } = data;
</script>

<section id="header-section">
	<div class="mx-auto w-full max-w-6xl lg:max-w-[90rem] px-4 pb-2 pt-4 md:pb-4 lg:pt-8">
		<ol class="breadcrumb lg:text-lg">
			<li class="crumb"><a class="anchor !text-surface-300" href="/conditions">Conditions</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li class="text-surface-300">{resortDetails.display_name}</li>
		</ol>

		<div class="mt-4 flex flex-col">
			<h1 class="h1">{resortDetails.display_name}</h1>
			<span class="flex items-center"
				><p class="mr-2 mt-2 text-xl font-semibold text-slate-400">Region:</p>
				<p class="mt-2 text-xl font-semibold">{resortDetails.region}</p></span
			>
				<div
					class="variant-ghost-secondary badge mt-2 w-[80px] capitalize lg:mt-4 lg:py-0 lg:text-lg lg:font-normal"
				>
					{resortDetails.location_type}
				</div>
		</div>
	</div>
</section>

<ResortLayout {resortDetails} />

<section id="forecast-section">
	<div class="mx-auto w-full max-w-6xl lg:max-w-[90rem] px-4 pt-4 pb-9 lg:pt-6">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Daily Forecast</h3>
				</div>
				<div class="flex h-full flex-col justify-evenly">
					<div class="flex justify-between sm:w-2/3 sm:self-center py-4">
						<div class="flex flex-col p-4">
							<p class="text-3xl font-bold">{resortDetails.current_temp}°</p>
							<p class="text-xl font-semibold">
								{weatherConditionsMap[resortDetails.current_weather]}
							</p>
							<div class="flex">
								<p>
									High {resortDetails.temperature_range[1].high_temp}&deg;
								</p>
								<p class=" mx-2">&middot;</p>
								<p>
									Low {resortDetails.temperature_range[1].low_temp}&deg;
								</p>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center p-8">
							<WeatherIcon weatherDesc={resortDetails.current_weather} size="large" />
						</div>
					</div>
					<div
						class="flex w-full items-center justify-between px-4 py-2 md:self-center md:py-6 xl:w-11/12"
					>
						{#each resortDetails.temperature_range as { date, low_temp, high_temp, snowfall }, i (i)}
							<WeatherForecastSlice
								{high_temp}
								{low_temp}
								weatherDesc={resortDetails.daily_weather_conditions[i].daily_weather}
								{date}
							/>
							{#if i < resortDetails.temperature_range.length - 1}
								<hr class="divider-vertical h-20" />
							{/if}
						{/each}
					</div>

					<Accordion class="py-10 lg:hidden">
						<AccordionItem>
							<svelte:fragment slot="summary"
								><p class="text-center">View Hourly Forecast</p></svelte:fragment
							>
							<svelte:fragment slot="content">
								<ul class="list">
									{#each resortDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
										<li class="!rounded-md">
											<div class="grid w-full grid-cols-6 items-center gap-3 p-2">
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
										<hr class="mt-1 opacity-60 last:hidden" />
									{/each}
								</ul>
							</svelte:fragment>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
			<div class="card mt-4 hidden w-full lg:block lg:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Hourly Forecast</h3>
				</div>
				<ul class="list max-h-[500px] overflow-auto px-4 py-6">
					{#each resortDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
						<li class="!rounded-md">
							<div class="grid w-full grid-cols-6 items-center gap-3 p-2">
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
												style="transform: rotate({parseInt(wind_deg_speed.split('/')[0], 10) +
													140}deg);"
											></i>&nbsp;
											{convertWindDirection(wind_deg_speed)}
										</p>
									</div>
								</span>
							</div>
						</li>
						<hr class="mt-1 opacity-60 last:hidden" />
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>


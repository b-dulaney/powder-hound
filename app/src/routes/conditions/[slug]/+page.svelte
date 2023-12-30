<script lang="ts">
	import WeatherForecastSlice from '$lib/components/weather-forecast-slice.svelte';
	import WeatherIcon from '$lib/components/weather-icon.svelte';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { convertWindDirection, convertWindSpeed, weatherConditionsMap } from '$lib/utils';
	import Snow from '$lib/components/snow.svelte';

	export let data: PageData;

	const { mountainDetails } = data;
	let recentChart;
	let upcomingChart;

	onMount(() => {
		const recentSnowChart = document.getElementById('recent-snowfall-chart') as HTMLCanvasElement;
		const upcomingSnowChart = document.getElementById(
			'upcoming-snowfall-chart'
		) as HTMLCanvasElement;
		recentChart = new Chart(recentSnowChart, {
			type: 'bar',
			data: {
				labels: mountainDetails.previous_snowfall_totals.map((snowfall) => snowfall.date),
				datasets: [
					{
						label: 'Snowfall (inches)',
						data: mountainDetails.previous_snowfall_totals.map(
							(snowfall) => snowfall.snowfall_total
						),
						backgroundColor: ['rgba(54, 162, 235, 0.4)'],
						borderColor: ['rgb(54, 162, 235)'],
						borderWidth: 1,
						maxBarThickness: 30
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value, index, values) {
								return value + '"';
							},
							stepSize: 1,
							maxTicksLimit: 5
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				},
				responsive: true
			}
		});

		upcomingChart = new Chart(upcomingSnowChart, {
			type: 'bar',
			data: {
				labels: mountainDetails.upcoming_snowfall_totals.map((snowfall) => snowfall.date).slice(-4),
				datasets: [
					{
						label: 'Snowfall (inches)',
						data: mountainDetails.upcoming_snowfall_totals
							.map((snowfall) => snowfall.snowfall_total)
							.slice(-4),
						backgroundColor: ['rgba(54, 162, 235, 0.4)'],
						borderColor: ['rgb(54, 162, 235)'],
						borderWidth: 1,
						maxBarThickness: 30,
						base: 0
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: function (value, index, values) {
								return value + '"';
							},
							stepSize: 1,
							maxTicksLimit: 5
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				},
				responsive: true
			}
		});
	});
</script>

<section id="header-section">
	<div class="mx-auto w-full max-w-6xl px-4 pb-2 pt-4 md:pb-4 lg:pt-16">
		<ol class="breadcrumb lg:text-lg">
			<li class="crumb"><a class="anchor" href="/conditions">Conditions</a></li>
			<li class="crumb-separator" aria-hidden>/</li>
			<li>{mountainDetails.display_name}</li>
		</ol>

		<div class="mt-4 flex flex-col">
			<h1 class="h1">{mountainDetails.display_name}</h1>
			<span class="flex items-center"
				><p class="mr-2 mt-2 text-xl font-semibold text-slate-400">Region:</p>
				<p class="mt-2 text-xl font-semibold">{mountainDetails.region}</p></span
			>
			{#if mountainDetails.location_type === 'resort'}
				<div
					class="variant-ghost-primary badge mt-2 w-[80px] capitalize lg:mt-4 lg:py-0 lg:text-lg lg:font-light"
				>
					{mountainDetails.location_type}
				</div>
			{:else}
				<div
					class="variant-ghost-success badge mt-2 w-[100px] capitalize lg:mt-4 lg:w-[120px] lg:py-1 lg:text-lg lg:font-light"
				>
					{mountainDetails.location_type}
				</div>
			{/if}
		</div>
	</div>
</section>

<section id="forecast-section">
	<div class="mx-auto w-full max-w-6xl px-4 pt-4 lg:pt-8">
		<div class="grid grid-cols-1 gap-4">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="flex h-full flex-col justify-around">
					<div class="card-header">
						<h3 class="h3">Daily Forecast</h3>
					</div>
					<div class="flex justify-between">
						<div class="flex flex-col p-4">
							<p class="text-3xl font-bold">{mountainDetails.current_temperature}°</p>
							<p class="text-xl font-semibold">
								{weatherConditionsMap[mountainDetails.current_weather]}
							</p>
							<div class="flex">
								<p>
									High {mountainDetails.temperature_range[0].high_temp}&deg;
								</p>
								<p class=" mx-2">&middot;</p>
								<p>
									Low {mountainDetails.temperature_range[0].low_temp}&deg;
								</p>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center p-8">
							<WeatherIcon weatherDesc={mountainDetails.current_weather} size="large" />
						</div>
					</div>
					<div
						class="flex w-full items-center justify-between px-4 py-2 md:self-center md:py-6 xl:w-11/12"
					>
						{#each mountainDetails.temperature_range as { date, low_temp, high_temp }, i (i)}
							<WeatherForecastSlice
								{high_temp}
								{low_temp}
								weatherDesc={mountainDetails.daily_weather_conditions[i].daily_weather}
								{date}
							/>
							{#if i < mountainDetails.temperature_range.length - 1}
								<hr class="divider-vertical h-20 opacity-40" />
							{/if}
						{/each}
					</div>

					<Accordion class="mt-2 lg:hidden">
						<AccordionItem>
							<svelte:fragment slot="summary"
								><p class="text-center">View Hourly Forecast</p></svelte:fragment
							>
							<svelte:fragment slot="content">
								<ul class="list">
									{#each mountainDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
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
				<div class="card-header py-2">
					<h3 class="h3">Hourly Forecast</h3>
				</div>
				<ul class="list max-h-[500px] overflow-auto p-4">
					{#each mountainDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
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

<section id="snow-report">
	<div class="mx-auto w-full max-w-6xl px-4 pb-8 pt-4">
		<div class="grid grid-cols-1 gap-8">
			<div class="card mt-4 w-full md:p-4 xl:p-6">
				<div class="card-header">
					<h3 class="h3">Snow Report</h3>
				</div>
				<div class="flex w-full flex-col items-center">
					<div class="mt-4 flex w-full flex-col items-center">
						<h4 class="h4">Past Week</h4>
						<div class="flex w-full items-center justify-center">
							<hr class="w-1/4 !border-slate-700 px-2" />
							<p class="px-6 text-xl">
								{mountainDetails.past7daysnowfall < 1 && mountainDetails.past7daysnowfall > 0
									? '< 1'
									: mountainDetails.past7daysnowfall}"
							</p>
							<hr class="w-1/4 !border-slate-700 px-2" />
						</div>
					</div>
					<div class="w-full p-4" id="recent-snowfall-chart-container">
						<canvas id="recent-snowfall-chart"></canvas>
					</div>
				</div>

				<div class="mt-4 flex w-full flex-col items-center">
					<p class="mt-2 text-xl font-bold">Next 72 Hours</p>
					<div class="flex w-full items-center justify-center">
						<hr class="w-1/4 !border-slate-700 px-2" />
						<p class="px-6 text-xl">
							{mountainDetails.next72hoursnowfall < 1 && mountainDetails.next72hoursnowfall > 0
								? '< 1'
								: mountainDetails.next72hoursnowfall}"
						</p>
						<hr class="w-1/4 !border-slate-700 px-2" />
					</div>
				</div>
				<div class="w-full p-4" id="upcoming-snowfall-chart-container">
					<canvas id="upcoming-snowfall-chart"></canvas>
				</div>
			</div>
		</div>
	</div>
</section>

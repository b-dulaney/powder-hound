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
				}
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

{#if mountainDetails.current_weather === 'snow'}
	<Snow />
{/if}

<section id="header-section">
	<ol class="breadcrumb pt-4 px-4">
		<li class="crumb">&lsaquo; <a class="anchor" href="/conditions">Conditions</a></li>
		<li class="crumb-separator" aria-hidden>/</li>
		<li>{mountainDetails.display_name}</li>
	</ol>

	<div class="py-4 px-4 lg:p-8 xl:p-16flex flex-col">
		<h1 class="h1">{mountainDetails.display_name}</h1>
		<span class="flex items-center"
			><p class="font-bold mt-2 text-xl text-slate-400 mr-2">Region:</p>
			<p class="text-xl font-bold mt-2">{mountainDetails.region}</p></span
		>
		{#if mountainDetails.location_type === 'resort'}
			<div class="badge variant-ghost-primary capitalize mt-2 w-[80px]">
				{mountainDetails.location_type}
			</div>
		{:else}
			<div class="badge variant-ghost-success capitalize mt-2 w-[100px]">
				{mountainDetails.location_type}
			</div>
		{/if}
	</div>
</section>

<section id="forecast-section" class="pt-8 px-4 lg:p-8 xl:p-16">
	<div class="flex justify-center mb-4">
		<h3 class="h3">Weather Forecast</h3>
	</div>
	<div class="card mt-4">
		<div class="flex flex-col">
			<div class="flex justify-between">
				<div class="flex flex-col p-4">
					<p class="text-2xl font-bold">{mountainDetails.current_temperature}°</p>
					<p class="text-xl font-bold">{weatherConditionsMap[mountainDetails.current_weather]}</p>
					<div class="flex">
						<p class="font-semibold">High {mountainDetails.temperature_range[0].high_temp}&deg;</p>
						<p class="font-semibold mx-2">&middot;</p>
						<p class="font-semibold">Low {mountainDetails.temperature_range[0].low_temp}&deg;</p>
					</div>
					<p class="text-xl"></p>
				</div>
				<div class="flex flex-col p-8 justify-center items-center">
					<WeatherIcon weatherDesc={mountainDetails.current_weather} size="large" />
				</div>
			</div>
			<div class="grid grid-cols-7 px-4 py-2 items-center w-full gap-0">
				{#each mountainDetails.temperature_range as { date, low_temp, high_temp }, i (i)}
					<WeatherForecastSlice
						{high_temp}
						{low_temp}
						weatherDesc={mountainDetails.daily_weather_conditions[i].daily_weather}
						{date}
					/>
					{#if i < mountainDetails.temperature_range.length - 1}
						<hr class="divider-vertical h-3/4 opacity-40" />
					{/if}
				{/each}
			</div>

			<Accordion class="my-2">
				<AccordionItem>
					<svelte:fragment slot="summary"
						><p class="text-center">View Hourly Forecast</p></svelte:fragment
					>
					<svelte:fragment slot="content">
						<ul class="list">
							{#each mountainDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
								<li class="!rounded-md">
									<div class="p-2 grid grid-cols-6 gap-3 items-center w-full">
										<p class="text-xs sm:text-sm text-surface-400">
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
											<p class="text-sm text-start">--</p>
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
								<hr class="opacity-60 mt-1 last:hidden" />
							{/each}
						</ul>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</section>

<section id="snow-report" class="py-8 px-4 lg:p-8 xl:p-16">
	<div class="flex justify-center mb-4">
		<h3 class="h3">Snow Report</h3>
	</div>
	<div class="card mt-4">
		<div class="flex flex-col items-center">
			<p class="text-xl font-bold mt-2">Past Week</p>
			<div class="flex w-full justify-center items-center">
				<hr class="w-1/4 px-2 !border-slate-700" />
				<p class="px-6 text-xl font-semibold">
					{mountainDetails.past7daysnowfall < 1 && mountainDetails.past7daysnowfall > 0
						? '< 1'
						: mountainDetails.past7daysnowfall}"
				</p>
				<hr class="w-1/4 px-2 !border-slate-700" />
			</div>
		</div>
		<div class="w-full p-2" id="recent-snowfall-chart-container">
			<canvas id="recent-snowfall-chart"></canvas>
		</div>
	</div>

	<div class="card mt-8">
		<div class="flex flex-col items-center">
			<p class="text-xl font-bold mt-2">Next 72 Hours</p>
			<div class="flex w-full justify-center items-center">
				<hr class="w-1/4 px-2 !border-slate-700" />
				<p class="px-6 text-xl font-semibold">
					{mountainDetails.next72hoursnowfall < 1 && mountainDetails.next72hoursnowfall > 0
						? '< 1'
						: mountainDetails.next72hoursnowfall}"
				</p>
				<hr class="w-1/4 px-2 !border-slate-700" />
			</div>
		</div>
		<div class="w-full p-2" id="upcoming-snowfall-chart-container">
			<canvas id="upcoming-snowfall-chart"></canvas>
		</div>
	</div>
</section>

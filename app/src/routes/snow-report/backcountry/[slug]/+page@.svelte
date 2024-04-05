<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';
	import { page } from '$app/stores';
	import Card from '$lib/components/card.svelte';
	import WeatherForecastSlice from '$lib/components/weather-forecast-slice.svelte';
	import WeatherIcon from '$lib/components/weather-icon.svelte';
	import { addAlertFailedToast, addAlertSuccessfulToast, convertWindDirection, convertWindSpeed, deleteAlertFailedToast, deleteAlertSuccessfulToast, weatherConditionsMap } from '$lib/utils';
	import { Accordion, AccordionItem, getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { selectedMountain } from '../../stores';
	import type { PageData } from './$types';

	import BackcountryLayout from './backcountry-layout.svelte';
	export let data: PageData;

	const { backcountryDetails, snowfallChartForecastData, snowfallChartHistoricalData } = data;
	$: session = data.session as Session | undefined;
	$: existingAlert = data.existingAlert;
	$: alertData = data.alertData;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	async function deleteAlert() {
		const alertId = alertData?.id;
		if (!alertId) return;

		const response = await fetch(`/api/alerts/${alertId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			existingAlert = false;
			alertData = undefined;
			toastStore.trigger(deleteAlertSuccessfulToast);
		} else {
			toastStore.trigger(deleteAlertFailedToast);
		}
	}

	async function addAlert() {
		if (session) {
				selectedMountain.set(backcountryDetails);
				new Promise<boolean>((resolve) => {
					const alertModal: ModalSettings = {
						type: 'component',
						title: 'Add Alert',
						component: 'alertModal',
						meta: {
							user_id: session?.user.id,
							email: session?.user.email
						},
						response: (r: any) => {
							resolve(r);
						}
					};
					modalStore.trigger(alertModal);
				}).then(async (r: any) => {
					if (r.success) {
						existingAlert = true;
						alertData = r.alertData;
						toastStore.trigger(addAlertSuccessfulToast);
					} else if (r.error) {
						toastStore.trigger(addAlertFailedToast);
					}
				});
			} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	};
</script>

<svelte:head>
	<title>
		PowderHound | {backcountryDetails.display_name} Snow Report and Avalanche Forecast
	</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content={`Get real-time snow reports, avalanche conditions, and accurate weather forecasts for ${backcountryDetails.display_name} | Stay informed with PowderHound`}
	/>
	<meta
		property="og:title"
		content="PowderHound | {backcountryDetails.display_name} Snow Report and Avalanche Forecast"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.toString()} />
	<meta
		property="og:image"
		content={`https://powderhound.io/og/backcountry?slug=${backcountryDetails.slug}`}
	/>
	<meta
		property="og:description"
		content={`Get real-time snow reports, avalanche conditions, and accurate weather forecasts for ${backcountryDetails.display_name} | Stay informed with PowderHound`}
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<section id="header-section">
	<div class="mx-auto w-full px-4 pb-2 pt-4 md:pb-4 lg:max-w-7xl lg:pt-8">
		<ol class="breadcrumb lg:text-lg">
			<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li class="crumb !ml-0 md:!ml-4">
				<a class="anchor !text-surface-300" href="/snow-report/backcountry">Snow Report</a>
			</li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li class="crumb text-surface-300">{backcountryDetails.display_name}</li>
		</ol>

		<div class="mt-4 flex flex-col">
			<h1 class="h1">{backcountryDetails.display_name} Snow Report</h1>
			<span class="flex items-center"
				><p class="mr-2 mt-2 text-xl font-semibold text-surface-300">Region:</p>
				<p class="mt-2 text-xl font-semibold">{backcountryDetails.region}</p></span
			>
			{#if existingAlert === false}
			<button type="button" on:click={addAlert} class="variant-ghost-secondary btn btn-sm md:btn-md mt-4 w-32">
				<span>Add alert</span>
				<i class="fa fa-bell"></i>
			</button>
			{/if}
			{#if existingAlert === true}
			<button type="button" on:click={deleteAlert} class="variant-ghost-error btn btn-sm md:btn-md mt-4 w-36">
				<span>Remove alert</span>
				<i class="fa fa-bell"></i>
			</button>
			{/if}
		</div>
	</div>
</section>

<BackcountryLayout {backcountryDetails} {snowfallChartForecastData} {snowfallChartHistoricalData} />

<section id="forecast-section">
	<div class="mx-auto mb-10 w-full px-4 lg:max-w-7xl">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<Card>
				<svelte:fragment slot="header">Daily Forecast</svelte:fragment>
				<svelte:fragment slot="body">
					<div class="flex h-full flex-col justify-evenly">
						<div class="flex justify-between py-4 sm:w-2/3 sm:self-center">
							<div class="flex flex-col p-4">
								<p class="text-3xl font-bold">{backcountryDetails.current_temperature}°</p>
								<p class="text-xl font-semibold">
									{weatherConditionsMap[backcountryDetails.current_weather]}
								</p>
								<div class="flex">
									<p>
										High {backcountryDetails.temperature_range[1].high_temp}&deg;
									</p>
									<p class=" mx-2">&middot;</p>
									<p>
										Low {backcountryDetails.temperature_range[1].low_temp}&deg;
									</p>
								</div>
							</div>
							<div class="flex flex-col items-center justify-center p-8">
								<WeatherIcon weatherDesc={backcountryDetails.current_weather} size="large" />
							</div>
						</div>
						<div
							class="flex w-full items-center justify-between px-4 py-2 md:self-center md:py-6 xl:w-11/12"
						>
							{#each backcountryDetails.temperature_range as { date, low_temp, high_temp, snowfall }, i (i)}
								<WeatherForecastSlice
									{high_temp}
									{low_temp}
									weatherDesc={backcountryDetails.daily_weather_conditions[i].daily_weather}
									{date}
								/>
								{#if i < backcountryDetails.temperature_range.length - 1}
									<hr class="divider-vertical h-20" />
								{/if}
							{/each}
						</div>

						<Accordion class="pb-12 lg:hidden">
							<AccordionItem>
								<svelte:fragment slot="summary"
									><p class="text-center">View Hourly Forecast</p></svelte:fragment
								>
								<svelte:fragment slot="content">
									<ul class="list">
										{#each backcountryDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
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
				</svelte:fragment>
			</Card>
			<div class="hidden lg:block">
				<Card>
					<svelte:fragment slot="header">Hourly Forecast</svelte:fragment>
					<svelte:fragment slot="body">
						<ul class="list max-h-[500px] overflow-auto px-4 py-6">
							{#each backcountryDetails.hourly_forecast as { datetime, temp, weather_desc, snowfall, wind_deg_speed }, i (i)}
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
					</svelte:fragment>
				</Card>
			</div>
		</div>
	</div>
</section>

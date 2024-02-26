<script lang="ts">
	import Snow from '$lib/components/snow.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import LogoIcon from '../public/logo-icon.png';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>PowderHound | Snow Reports and Powder Alerts for Colorado</title>
	<meta
		name="description"
		content="Get real-time snow reports, accurate weather predictions, and customized snowfall alerts for Colorado - all 100% free. You'll never miss another powder day."
	/>
	<meta property="og:site_name" content="PowderHound" />
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:title" content="PowderHound | Snow Reports and Powder Alerts for Colorado" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io" />
	<meta property="og:image" content="https://powderhound.io/og" />
	<meta
		property="og:description"
		content="Get real-time snow reports, accurate weather predictions, and customized snowfall alerts for Colorado - all 100% free. You'll never miss another powder day."
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<Snow height="h-[600px]" zIndex="-z-10" />

<header class="py-8 xl:pt-16" id="hero">
	<div class="grid grid-cols-1 items-center gap-4 md:gap-10">
		<div class="flex flex-col items-center space-y-4 px-4 text-center">
			<enhanced:img
				src="../public/new-logo-v2.png"
				alt="Powder Hound Logo"
				class="z-0 h-36 w-36 lg:h-52 lg:w-52"
			/>
			<h1 class="h1 z-0 max-w-xl text-5xl">You'll never miss another powder day.</h1>
			<p class="z-0 max-w-xl text-xl">
				View the current snow report, get accurate predictions, and receive customized snowfall
				alerts - all 100% free.
			</p>
			<div class="z-0 flex gap-4">
				<a
					class="variant-filled-primary btn bg-gradient-to-r"
					data-sveltekit-preload-data="hover"
					href="/snow-report/resorts"
				>
					<div class="flex items-center gap-2">
						<span>View Snow Report</span>
						<i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
					</div>
				</a>
					<a class="variant-ghost-secondary btn" href="/alerts">Get Alerts</a>
			</div>
		</div>
	</div>
</header>

<section id="forecasts" class="built-for-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
		<div class="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-10">
			<div class="space-y-4">
				<h2 class="h2">Built for Colorado</h2>
				<p>
					Powder Hound sources weather data directly from the
					<a class="anchor" target="_blank" rel="no-referrer" href="https://avalanche.state.co.us/"
						>Colorado Avalanche Information Center</a
					>
					(CAIC) in combination with NOAA
					<a
						class="anchor"
						target="_blank"
						rel="no-referrer"
						href="https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast"
					>
						GFS</a
					>
					and
					<a
						class="anchor"
						target="_blank"
						rel="no-referrer"
						href="https://rapidrefresh.noaa.gov/hrrr/"
					>
						HRRR</a
					> forecasts to provide the most accurate snowfall predictions for Colorado's premier ski destinations.
				</p>
				<hr class="opacity-60" />
				<p class="pb-2">
					Weather forecasts are available up to 72 hours in advance and are updated hourly. For
					in-bounds locations, PowderHound provides information on snowpack, lift status, open
					terrain, and more.
				</p>
			</div>
			<div class="card">
				<section class="p-4">
					<h3 class="h3">CAIC Point Forecasts</h3>
					<p class="pt-1">
						Broken down into hourly data points for any location in the state, these high-res
						forecasts provide accurate snow and weather predictions that are tailored to Colorado.
						For those interested in learning more about the underlying models and methods, check out
						the CAIC's
						<a
							class="anchor"
							rel="no-referrer"
							target="_blank"
							href="https://avalanche.state.co.us/weather/forecast-models/about">about</a
						>
						page.
					</p>
				</section>
				<footer class="card-footer mt-2 flex justify-center">
					<enhanced:img
						src="../public/WRFExample.png"
						alt="CAIC forecast graph"
						class="w-[350px] rounded-lg"
					/>
				</footer>
			</div>
		</div>
	</div>
</section>

<section id="alerts" class="bg-surface-50-900-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
		<div class="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-10">
			<div class="space-y-4 md:order-last">
				<h2 class="h2">Tailored Alerts</h2>
				<p>
					Sign up for alerts and you'll get notified when it's piling up on your favorite tree runs.
					Just pick the locations and snowfall thresholds, and we'll let you know when it's going to
					be a powder day.
				</p>
			</div>
			<div class="grid grid-cols-[auto_1fr] gap-2 py-2">
				<Avatar src={LogoIcon} width="w-12" background="bg-transparent" />
				<div class="card variant-filled-secondary space-y-2 rounded-tl-none p-4">
					<header class="flex items-center justify-between">
						<p class="font-bold">PowderHound</p>
						<small class="opacity-50">5:30 am</small>
					</header>
					<p>It's coming down! Copper Mountain has received 12" of snow overnight.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="passes" class="passes-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
		<div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
			<div class="space-y-4">
				<h2 class="h2">Know Before You Go</h2>
				<p>
					Get the avalanche forecast and weather conditions for your favorite backcountry spots.
					PowderHound can help you make informed decisions about your next trip beyond the ropes.
				</p>
			</div>
			<div class="flex justify-between gap-2">
				<enhanced:img src="../public/avy-danger-low.png" alt="Avalanche danger low icon" />
				<enhanced:img
					src="../public/avy-danger-moderate.png"
					alt="Avalanche danger moderate icon"
				/>
				<enhanced:img
					src="../public/avy-danger-considerable.png"
					alt="Avalanche danger considerable icon"
				/>
				<enhanced:img src="../public/avy-danger-high.png" alt="Avalanche danger high icon" />
			</div>
		</div>
	</div>
</section>

<section id="stats" class="stats-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
		<div class="flex flex-col items-center justify-center gap-10 lg:flex-row">
			<div class="space-y-1">
				<span class="block text-8xl font-bold font-heading-token">30+</span>
				<p class="block pl-1 opacity-50">Total locations</p>
			</div>
			<div
				class="w-20 border-t border-surface-500/50 lg:h-20 lg:w-1 lg:border-l lg:border-t-0"
			></div>
			<div class="space-y-1">
				<span class="block text-8xl font-bold font-heading-token">10+</span>
				<p class="block pl-1 opacity-50">Backcountry zones</p>
			</div>
			<div
				class="w-20 border-t border-surface-500/50 lg:h-20 lg:w-1 lg:border-l lg:border-t-0"
			></div>
			<div class="space-y-1">
				{#await data.streamed.caicDataCount}
					<div class="placeholder animate-pulse"></div>
					<p class="block opacity-50">Hourly data points</p>
				{:then caicDataCount}
					<span class="block text-8xl font-bold font-heading-token">{caicDataCount}</span>
					<p class="block opacity-50">Hourly data points</p>
				{:catch error}
					<span class="block text-8xl font-bold font-heading-token">60K+</span>
					<p class="block opacity-50">Hourly data points</p>
				{/await}
			</div>
		</div>
	</div>
</section>

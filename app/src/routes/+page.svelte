<script lang="ts">
	import Snow from '$lib/components/snow.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import LogoIcon from '../public/logo-icon.png';
	import type { PageData } from './$types';

	export let data: PageData;
	const { session } = data;
</script>

<Snow height="h-[600px]" zIndex="-z-10" />

<header class="py-8 xl:pt-16" id="hero">
	<div class="grid grid-cols-1 items-center gap-4 md:gap-10">
		<div class="flex flex-col items-center space-y-4 px-4 text-center">
			<enhanced:img src='../public/new-logo-v2.png' alt="Powder Hound Logo" class="z-10 h-36 w-36 lg:h-52 lg:w-52" />
			<h1 class="h1 z-10 max-w-xl text-5xl">You'll never miss another powder day.</h1>
			<p class="z-10 max-w-xl text-xl">
				View current snow conditions, get accurate predictions, and receive customized snowfall alerts -
				all 100% free.
			</p>
			<div class="z-10 flex gap-4">
				<a
					class="btn variant-filled-primary bg-gradient-to-r"
					data-sveltekit-preload-data="hover"
					href="/conditions"
				>
					<div class="flex items-center gap-2">
						<span>View Conditions</span>
						<i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
					</div>
				</a>
				{#if !session}
					<a class="variant-ghost-secondary btn" href="/signup">Get Alerts</a>
				{/if}
			</div>
		</div>
	</div>
</header>

<section id="forecasts" class="built-for-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-8">
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
				<hr class="opacity-20" />
				<p>
					Weather forecasts are available up to 72 hours in advance and are updated hourly.
					Accumulated snowfall is updated constantly, so you'll always have the full picture when
					deciding where to ride.
				</p>
			</div>
			<div class="card">
				<section class="p-4">
					<h3 class="h3">CAIC Point Forecasts</h3>
					<p>
						CAIC Point Forecasts are broken down into 1 hour data points for nearly every resort and
						mountain pass in the state. For those interested in learning more about the underlying
						models and methods, check out the CAIC's
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
					<enhanced:img src="../public/WRFExample.png" alt="CAIC forecast graph" class="w-[350px] rounded-lg" />
				</footer>
			</div>
		</div>
	</div>
</section>

<section id="alerts" class="alerts-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-8">
		<div class="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-10">
			<div class="space-y-4 md:order-last">
				<h2 class="h2">Tailored Alerts</h2>
				<p>
					Sign up for alerts and you'll get a text when it's piling up on your favorite tree runs.
					Just pick the locations and snowfall thresholds, and we'll let you know when it's going to
					be a pow day.
				</p>
			</div>
			<div class="grid grid-cols-[auto_1fr] gap-2 py-2">
				<Avatar src={LogoIcon} width="w-12" background="bg-transparent" />
				<div class="card variant-filled-secondary space-y-2 rounded-tl-none p-4">
					<header class="flex items-center justify-between">
						<p class="font-bold">PowderHound</p>
						<small class="opacity-50">5:00 am</small>
					</header>
					<p>It's coming down! Copper Mountain has received 12" of snow since midnight.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="passes" class="passes-gradient bg-surface-100-800-token">
	<div class="mx-auto w-full max-w-6xl px-4 py-8">
		<div class="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-10">
			<div class="space-y-4">
				<h2 class="h2">Beyond Passes</h2>
				<p>
					Whether you ride a season pass, an independent mountain, or something a little more out
					there - we've got you covered. PowderHound currently provides forecasts for 20+ mountains
					and backcountry zones across Colorado.
				</p>
			</div>
			<div class="flex justify-center gap-2 md:py-16">
				<a class="variant-ghost-primary btn" data-sveltekit-preload-data="hover" href="/conditions">
					<div class="flex items-center gap-2">
						<span>Find Powder</span>
						<i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
					</div>
				</a>
			</div>
		</div>
	</div>
</section>

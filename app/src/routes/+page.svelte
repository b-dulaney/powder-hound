<script lang="ts">
	import PineTreeSolid from '$lib/components/icons/PineTreeSolid.svelte';
	import SkiLiftSolid from '$lib/components/icons/SkiLiftSolid.svelte';
	import Snow from '$lib/components/snow.svelte';
	import { A, Avatar, Button, Heading, P, Span } from 'flowbite-svelte';
	import { FeatureDefault, FeatureItem, HeroHeader, Section } from 'flowbite-svelte-blocks';
	import AngleRightOutline from 'flowbite-svelte-icons/AngleRightOutline.svelte';
	import BellSolid from 'flowbite-svelte-icons/BellSolid.svelte';
	import ChevronRightOutline from 'flowbite-svelte-icons/ChevronRightOutline.svelte';
	import EnvelopeSolid from 'flowbite-svelte-icons/EnvelopeSolid.svelte';
	import ReceiptSolid from 'flowbite-svelte-icons/ReceiptSolid.svelte';
	import UsersGroupSolid from 'flowbite-svelte-icons/UsersGroupSolid.svelte';
	import LogoIcon from '../public/logo-icon.png';
	import AvyDangerLow from '../public/avy-danger-low.png';
	import AvyDangerModerate from '../public/avy-danger-moderate.png';
	import AvyDangerConsiderable from '../public/avy-danger-considerable.png';
	import AvyDangerHigh from '../public/avy-danger-high.png';

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

<header class="relative py-8 xl:pt-16" id="hero">
	<Snow />

	<div class="hero-gradient" />
	<div class="mx-auto flex max-w-screen-xl items-center justify-center">
		<div class="flex flex-col items-center space-y-6 px-4 lg:p-8">
			<a
				href="https://github.com/b-dulaney/powder-hound?tab=readme-ov-file#roadmap"
				class="hidden items-center justify-between rounded-full bg-surface-50 px-1 py-1 pr-4 text-sm hover:bg-surface-100 dark:bg-surface-700 dark:hover:bg-surface-600 lg:inline-flex"
			>
				<Span class="z-10 mr-3 rounded-full bg-primary-500 px-4 py-1.5 text-xs text-surface-50"
					>New</Span
				>
				<Span class="text-sm font-medium"
					>PowderHound is in beta. Read more about the roadmap here!</Span
				>
				<AngleRightOutline class="ms-2 h-5 w-5 text-surface-500 dark:text-white" />
			</a>
			<enhanced:img src="../public/logo.png" class="h-36 w-36 lg:hidden" alt="PowderHound Logo" />

			<h1
				class="h1 max-w-2xl text-center text-5xl font-extrabold leading-none tracking-tight text-surface-900 dark:text-white xl:text-6xl"
			>
				You'll never miss another powder day
			</h1>
			<p class="max-w-xl text-center text-xl font-semibold text-surface-900 dark:text-white">
				View the current snow report, get accurate predictions, and receive customized snowfall
				alerts - all 100% free.
			</p>
			<div class="flex justify-center gap-4 lg:justify-start">
				<Button href="/snow-report/resorts">
					<span>View Snow Report</span>
					<AngleRightOutline class="ms-2 h-5 w-5" />
				</Button>
				<Button
					href="/sign-up"
					color="alternative"
					class="dark:border-surface-700 dark:bg-surface-700 dark:text-white dark:hover:border-surface-600 dark:hover:bg-surface-600"
				>
					<EnvelopeSolid class="me-2 h-5 w-5" />
					<span>Sign Up</span>
				</Button>
			</div>
		</div>
	</div>
</header>

<Section name="feature" sectionClass="bg-surface-50 dark:bg-surface-900 py-8">
	<HeroHeader
		class="mx-auto mb-8 max-w-screen-xl py-0 sm:py-0 lg:mb-16"
		h2Class="mb-4 text-4xl tracking-tight font-extrabold text-surface-900 dark:text-white lg:text-center"
		pClass="text-surface-500 sm:text-xl max-w-2xl dark:text-surface-400 lg:text-center lg:mx-auto"
	>
		<svelte:fragment slot="h2">Designed for riders like you</svelte:fragment>
		<svelte:fragment slot="paragraph"
			>For weekend warriors, seasoned splitboarders, and everything in-between. PowderHound helps
			you plan your adventures with confidence.</svelte:fragment
		>
	</HeroHeader>
	<FeatureDefault divClass="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><BellSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Customized Alerts</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Stay ahead of the snow. Our daily forecasts and overnight alerts will ensure that you're
				always ready for epic powder days.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><SkiLiftSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Resort Data</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Access lift status, snow conditions, and grooming reports for all of your favorite
				mountains - updated hourly.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><PineTreeSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Backcountry Zones</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Go beyond the ropes with recent snowfall data, avalanche forecasts, and snowpack analysis
				for all of the western US.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><i class="fa fa-solid fa-cloud text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Weather Forecasts</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Our forecasts come directly from the best in the game. Hourly datapoints with dozens of
				properties show you how each day will unfold.
			</svelte:fragment>
		</FeatureItem>
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><ReceiptSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Beyond Passes</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Explore Ikon, Epic, and independent destinations in one convenient location. PowderHound
				has you covered no matter where you ride.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem pClass="text-surface-500 dark:text-surface-400 max-w-md">
			<svelte:fragment slot="icon"
				><UsersGroupSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Open Source</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>Built by the community, for the community. PowderHound is open source and 100% free to use.
				No subscription required.</svelte:fragment
			>
		</FeatureItem>
	</FeatureDefault>
</Section>

<section id="contentwithimg" class="relative bg-surface-100 py-6 dark:bg-surface-950 sm:py-10">
	<div
		class="mx-auto max-w-screen-xl items-center gap-8 px-4 py-8 md:grid md:grid-cols-2 lg:px-6 lg:py-16"
	>
		<div class="font-light text-surface-500 dark:text-surface-400 sm:text-lg">
			<Heading tag="h2" class="mb-4">Powered by data you can trust</Heading>
			<P class="mb-4">
				PowderHound is built on top of high-resolution weather data from the
				<A aClass="whitespace-pre-wrap hover:underline" href="https://avalanche.state.co.us/">
					Colorado Avalanche Information Center
				</A>
				(CAIC) in combination with NOAA
				<A href="https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast">GFS</A>
				and
				<A href="https://rapidrefresh.noaa.gov/hrrr/">HRRR</A>
				forecasts to provide the most accurate snowfall predictions for your favorite winter destinations.
			</P>
			<A
				href="/"
				class="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700"
			>
				Learn more about the CAIC
				<ChevronRightOutline class="ms-1 mt-1" />
			</A>
		</div>

		<div class="grid grid-cols-1 lg:justify-items-end">
			<enhanced:img
				class="mt-5 w-[350px] rounded-lg -hue-rotate-60 lg:mt-10"
				src="/src/public/WRFExample.png"
				alt="CAIC forecast graph"
			/>
		</div>
	</div>
</section>

<section id="alerts" class="bg-surface-100 dark:bg-surface-950">
	<div class="mx-auto w-full max-w-screen-xl px-6 py-8 lg:py-24">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-10 lg:items-start">
			<div class="space-y-4 md:order-last">
				<Heading tag="h2">Tailored Notifications</Heading>
				<P>
					Sign up for alerts and you'll get notified when it's piling up on your favorite tree runs.
					Just pick the locations and snowfall thresholds, and we'll let you know when it's going to
					be a powder day.
				</P>
			</div>
			<div class="grid grid-cols-[auto_1fr] gap-2 py-2">
				<Avatar
					src={LogoIcon}
					dot={{ placement: 'bottom-right', color: 'green' }}
					class="bg-surace-50 dark:bg-surface-950 lg:h-20 lg:w-20"
				/>
				<div class="flex w-full max-w-[350px] flex-col gap-1">
					<div class="flex items-center space-x-2">
						<span class="text-sm font-semibold text-surface-900 dark:text-white md:text-lg"
							>PowderHound</span
						>
						<span class="text-sm font-normal text-surface-500 dark:text-surface-400 md:text-base"
							>6:05am</span
						>
					</div>
					<div
						class="leading-1.5 flex flex-col rounded-e-xl rounded-es-xl border-primary-200 bg-primary-100 p-4 dark:bg-surface-600"
					>
						<P class="text-base lg:text-lg">
							It's coming down! Copper Mountain has received 12" of snowfall in the last 24 hours.
						</P>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="know-before-you-go" class="bg-surface-50 dark:bg-surface-900">
	<div class="mx-auto w-full max-w-screen-xl px-4 py-16 md:py-24">
		<div class="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
			<div class="space-y-4">
				<Heading tag="h2">Know Before You Go</Heading>
				<P>
					Get the avalanche forecast and weather conditions for your favorite backcountry spots.
					PowderHound can help you make informed decisions about your next trip beyond the ropes.
				</P>
			</div>
			<div class="relative flex max-w-full items-center justify-center">
				<img
					src={AvyDangerLow}
					class="relative z-10 -mr-[120px] w-40 sm:w-48"
					alt="Avalanche danger low icon"
				/>
				<img
					src={AvyDangerModerate}
					class="relative z-20 -mr-[100px] w-40 sm:w-48"
					alt="Avalanche danger moderate icon"
				/>
				<img
					src={AvyDangerConsiderable}
					class="relative z-30 -mr-[100px] w-40 sm:w-48"
					alt="Avalanche danger considerable icon"
				/>
				<img
					src={AvyDangerHigh}
					class="relative z-40 mr-[20px] w-40 sm:w-48"
					alt="Avalanche danger high icon"
				/>
			</div>
		</div>
	</div>
</section>

<section id="stats" class="bg-surface-50 dark:bg-surface-900">
	<div class="mx-auto w-full max-w-screen-xl px-4 py-16 md:py-24">
		<div class="flex flex-col items-center justify-center gap-10 md:flex-row">
			<div class="space-y-1">
				<span class="block text-8xl font-bold text-surface-900 dark:text-white">30+</span>
				<P class="block pl-1 opacity-50">Total locations</P>
			</div>
			<div
				class="w-20 border-t border-surface-500/50 md:h-20 md:w-1 md:border-l md:border-t-0"
			></div>
			<div class="space-y-1">
				<span class="block text-8xl font-bold text-surface-900 dark:text-white">10+</span>
				<P class="block pl-1 opacity-50">Backcountry zones</P>
			</div>
			<div
				class="w-20 border-t border-surface-500/50 md:h-20 md:w-1 md:border-l md:border-t-0"
			></div>
			<div class="space-y-1">
				{#await data.streamed.caicDataCount}
					<div class="placeholder animate-pulse"></div>
					<P class="block opacity-50">Hourly data points collected</P>
				{:then caicDataCount}
					<span class="block text-8xl font-bold text-surface-900 dark:text-white"
						>{caicDataCount}</span
					>
					<P class="block opacity-50">Hourly data points collected</P>
				{:catch error}
					<span class="block text-8xl font-bold text-surface-900 dark:text-white">60K+</span>
					<P class="block opacity-50">Hourly data points collected</P>
				{/await}
			</div>
		</div>
	</div>
</section>

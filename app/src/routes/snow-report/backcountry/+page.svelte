<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import BackcountryTable from './backcountry-table.svelte';
	export let data: PageData;
	const { backcountryOverviews } = data;
	$: alerts = data.alerts ?? [];
	$: session = data.session;
</script>

<svelte:head>
	<title>PowderHound | Backcountry Snow Reports and Avalanche Forecasts</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content="Get real-time snow reports, avalanche conditions, and accurate weather forecasts for Colorado's backcountry ski destinations | Stay informed with PowderHound"
	/>
	<meta
		property="og:title"
		content="PowderHound | Backcountry Snow Reports and Avalanche Forecasts"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/snow-report/backcountry" />
	<meta property="og:image" content="https://powderhound.io/og?title=Snow Report - Backcountry" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content="Get real-time snow reports, avalanche conditions, and accurate weather forecasts for Colorado's backcountry ski destinations | Stay informed with PowderHound"
	/>
</svelte:head>

<Heading
	tag="h1"
	class="py-4 text-center text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:py-8 sm:text-4xl sm:font-extrabold"
	>Backcountry Snow Report
</Heading>

<section class="mx-auto w-full max-w-screen-2xl pb-10 sm:pb-16 md:px-4">
	<BackcountryTable {backcountryOverviews} {session} alerts={alerts ?? []} />
</section>

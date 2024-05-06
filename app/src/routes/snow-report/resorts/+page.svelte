<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import ResortsTable from './resorts-table.svelte';
	import PageHeading from '$lib/components/PageHeading.svelte';
	export let data: PageData;
	const { resortOverviews } = data;
	$: alerts = data.alerts ?? [];
	$: session = data.session;
</script>

<svelte:head>
	<title>PowderHound | Resort Snow Reports and Mountain Conditions</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content="Get real-time snow reports, mountain conditions, and accurate weather forecasts for Colorado's premier ski destinations | Stay informed with PowderHound"
	/>
	<meta property="og:title" content="PowderHound | Resort Snow Reports and Mountain Conditions" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/snow-report/resorts" />
	<meta property="og:image" content={`https://powderhound.io/og?title=Snow Report - Resorts`} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content="Get real-time snow reports, mountain conditions, and accurate weather forecasts for Colorado's premier ski destinations | Stay informed with PowderHound"
	/>
</svelte:head>

<PageHeading title="Resort Snow Report" />

<section class="mx-auto w-full max-w-screen-xl pb-10 sm:pb-16 md:px-4">
	<ResortsTable {resortOverviews} {session} {alerts} />
</section>

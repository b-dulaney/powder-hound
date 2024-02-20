<script lang="ts">
    import type { PageData } from './$types';
    import { backcountrySearchInput } from '../stores';
	import BackcountryTable from './backcountry-table.svelte';
    export let data: PageData;
    const { backcountryOverviews } = data;
    $: alerts = data.alerts ?? [];
    $: session = data.session;
    let filteredBackcountry = backcountryOverviews;

	backcountrySearchInput.subscribe((value) => {
	filteredBackcountry =
		backcountryOverviews.filter((location) => {
			return location?.display_name?.toLowerCase().includes(value.toLowerCase().trim());
		}) || [];
	});

</script>

<svelte:head>
	<title>
		PowderHound | Backcountry Snow Reports and Avalanche Forecasts
	</title>
    <meta name="description" content="Get real-time snow reports, avalanche conditions, and accurate weather forecasts for Colorado's backcountry ski destinations | Stay informed with PowderHound">
	<meta property="og:title" content="PowderHound | Backcountry Snow Reports and Avalanche Forecasts" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/snow-report/backcountry" />
	<meta property="og:image" content='https://powderhound.io/og?title=Snow Report - Backcountry' />
	<meta property="og:image:type" content="image/png">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:description" content="Get real-time snow reports, avalanche conditions, and accurate weather forecasts for Colorado's backcountry ski destinations | Stay informed with PowderHound" />
</svelte:head>

<section class="mx-auto w-full lg:max-w-7xl md:px-4">
    <BackcountryTable backcountryOverviews={filteredBackcountry} session={session} alerts={alerts ?? []} />
</section>
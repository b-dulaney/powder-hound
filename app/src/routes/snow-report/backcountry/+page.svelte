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
</svelte:head>

<section class="mx-auto w-full lg:max-w-7xl md:px-4">
    <BackcountryTable backcountryOverviews={filteredBackcountry} session={session} alerts={alerts ?? []} />
</section>
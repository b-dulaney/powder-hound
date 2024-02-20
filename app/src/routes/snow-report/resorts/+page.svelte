<script lang="ts">
    import type { PageData } from './$types';
    import { resortSearchInput } from '../stores';
	import ResortsTable from './resorts-table.svelte';
    export let data: PageData;
    const { resortOverviews } = data;
    $: alerts = data.alerts ?? [];
    $: session = data.session;
    let filteredResorts = resortOverviews;

    resortSearchInput.subscribe((value) => {
        filteredResorts =
            resortOverviews.filter((location) => {
                return location?.display_name?.toLowerCase().includes(value.toLowerCase().trim());
            }) || [];
        });

</script>

<svelte:head>
	<title>
		PowderHound | Resort Snow Reports and Mountain Conditions
	</title>
    <meta name="description" content="Get real-time snow reports, mountain conditions, and accurate weather forecasts for Colorado's premier ski destinations | Stay informed with PowderHound">
</svelte:head>

<section class="mx-auto w-full lg:max-w-7xl md:px-4">
    <ResortsTable resortOverviews={filteredResorts} session={session} alerts={alerts} />
</section>
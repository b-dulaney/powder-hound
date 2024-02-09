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
		PowderHound - Resort forecasts and lift/trail status
	</title>
    <meta name="description" content="Snow forecasts, snowpack info, and lift/trail status for Colorado's ski resorts">
</svelte:head>

<section class="mx-auto w-full lg:max-w-[90rem] md:px-4">
    <ResortsTable resortOverviews={filteredResorts} session={session} alerts={alerts} />
</section>
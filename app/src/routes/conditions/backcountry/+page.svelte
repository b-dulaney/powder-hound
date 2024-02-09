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

<section class="mx-auto w-full lg:max-w-[90rem] md:px-4">
    <BackcountryTable backcountryOverviews={filteredBackcountry} session={session} alerts={alerts ?? []} />
</section>
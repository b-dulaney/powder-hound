<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import BackcountryTable from './backcountry-table.svelte';
	import ResortsTable from './resorts-table.svelte';
	export let data: PageData;
	const { resortOverviews, backcountryOverviews, profile } = data;
	import { resortSearchInput, backcountrySearchInput } from './stores';

	let tabSet: number = 0;
	let filteredResorts = resortOverviews;
	let filteredBackcountry = backcountryOverviews;

	resortSearchInput.subscribe((value) => {
        filteredResorts =
			resortOverviews.filter((location) => {
				return location?.display_name?.toLowerCase().includes(value.toLowerCase().trim());
			}) || [];
        });

	backcountrySearchInput.subscribe((value) => {
	filteredBackcountry =
		backcountryOverviews.filter((location) => {
			return location?.display_name?.toLowerCase().includes(value.toLowerCase().trim());
		}) || [];
	});

</script>

<section class="pt-8 md:p-4 max-w-[120rem] mx-auto lg:p-8 xl:p-16">
	<div class="mb-4 flex justify-center">
		<h1 class="h1">Conditions</h1>
	</div>

	<div class="pt-4 flex w-full justify-center">
		<TabGroup justify="justify-center">
			<Tab bind:group={tabSet} value={0} name="Ski Resorts" class="md:text-xl">
				Ski Resorts
			</Tab>
			<Tab bind:group={tabSet} value={1} name="Backcountry" class="md:text-xl">
				Backcountry
			</Tab>
		</TabGroup>
	</div>


	{#if tabSet ===  0}
		<ResortsTable resortOverviews={filteredResorts} favorites={profile?.favorites ?? []} />
	{:else}
		<BackcountryTable backcountryOverviews={filteredBackcountry} favorites={profile?.favorites ?? []} />
	{/if}
</section>

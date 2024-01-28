<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import BackcountryTable from './backcountry-table.svelte';
	import ResortsTable from './resorts-table.svelte';
	export let data: PageData;
	const { resortOverviews, backcountryOverviews, profile, session } = data;
	import { resortSearchInput, backcountrySearchInput, activeTab } from './stores';

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

<section class="mx-auto w-full lg:max-w-[90rem] md:px-4 pb-2 pt-4 md:pb-4 lg:pt-8">
	<ol class="breadcrumb lg:text-lg px-4 md:px-0 pb-5">
		<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li class="text-surface-300">Conditions</li>
	</ol>
	<div class="lg:mb-4 flex justify-center">
		<h1 class="h1">Conditions</h1>
	</div>

	<div class="pt-4 flex w-full justify-center">
		<TabGroup justify="justify-center">
			<Tab bind:group={$activeTab} value={0} name="Ski Resorts" class="md:text-xl">
				Ski Resorts
			</Tab>
			<Tab bind:group={$activeTab} value={1} name="Backcountry" class="md:text-xl">
				Backcountry
			</Tab>
		</TabGroup>
	</div>


	{#if $activeTab ===  0}
		<ResortsTable resortOverviews={filteredResorts} favorites={profile?.favorites ?? []} />
	{:else}
		<BackcountryTable backcountryOverviews={filteredBackcountry} favorites={profile?.favorites ?? []} />
	{/if}
</section>

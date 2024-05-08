<script lang="ts">
	import AddAlertButton from '$lib/components/AddAlertButton.svelte';
	import EditAlertButton from '$lib/components/EditAlertButton.svelte';
	import FilterDropdown from '$lib/components/datatable/FilterDropdown.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
	import { formatSnowfall } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import {
		Button,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { reload } from './api';

	// Props
	export let session: Session | null;
	export let resortOverviews: ResortOverview[];
	export let alerts: UserAlerts[];

	// Component variables
	const handler = new DataHandler<ResortOverview>(resortOverviews);
	const rows = handler.getRows();

	let showClosed = false;

	// Component state
	$: alerts = alerts;
	$: mappedAlerts = alerts.map((alert) => alert.mountain_id);

	// Handlers and functions
	handler.sortAsc('display_name');
	handler.filter('false', 'closed');
	handler.onChange((state: State) => reload(state));

	$: isFavorite = (mountain: ResortOverview) => mappedAlerts.includes(mountain.mountain_id);

	const handleClickShowClosed = () => {
		showClosed = !showClosed;
		handler.clearFilters();
		handler.invalidate();
	};
</script>

<div class="space-y-4">
	<header class="flex justify-between px-2">
		<Search {handler} />
		<FilterDropdown bind:showClosed {handler} />
	</header>
	<Table
		divClass="relative overflow-x-hidden sm:overflow-x-auto border dark:border-surface-700 rounded-lg"
	>
		<caption class="sr-only"
			>Snow and weather conditions for CO ski resorts. Column headers are sortable. Switch between
			categories with the tabs above.</caption
		>
		<TableHead class="dark:bg-surface-800">
			<ThSort {handler} orderBy="display_name"><Span class="font-bold">Location</Span></ThSort>
			<ThSort {handler} orderBy="base_depth" center
				><Span class="font-bold sm:after:content-['_Depth']">Base</Span></ThSort
			>
			<ThSort {handler} orderBy="runs_open" classes="hidden lg:px-3 py-4 lg:table-cell" center
				><Span class="font-bold">Runs Open</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_past_24h" center
				><Span class="font-bold sm:before:content-['Last_']">24h</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_next_24h" classes="hidden md:px-3 py-4 md:table-cell" center
				><Span class="font-bold">Next 24h</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_next_72h" classes="hidden md:px-3 py-4 md:table-cell" center
				><Span class="font-bold">Next 72h</Span></ThSort
			>
			<TableHeadCell aria-hidden></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="dark:border-surface-700">
			{#if !$rows.length}
				<TableBodyRow class="w-full text-center dark:bg-surface-900">
					<TableBodyCell class="w-full" colspan="7">
						<div class="flex w-full flex-col items-center justify-center gap-4">
							<p class="text-base">No results found</p>
							{#if showClosed === false}
								<Button color="alternative" on:click={handleClickShowClosed}
									>Show Closed Resorts</Button
								>
							{/if}
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#each $rows as row}
				<TableBodyRow class="dark:border-surface-700 dark:bg-surface-900">
					<TableBodyCell class="p-0">
						<a
							class="flex flex-col gap-1 px-3 py-4 dark:text-primary-300"
							href="/snow-report/resorts/{row.slug}"
							data-sveltekit-preload-data="hover"
							><span class="text-primary-700 dark:text-primary-300 xl:text-lg"
								>{row.display_name}</span
							>
							<p class="text-xs text-surface-700 dark:text-surface-500">
								{row.state} | {row.region}
							</p>
						</a>
					</TableBodyCell>
					<TableBodyCell class="px-3 py-4 text-center font-bold"
						>{row.closed ? '--' : formatSnowfall(row.base_depth)}</TableBodyCell
					>
					<TableBodyCell class="hidden px-3 py-4 text-center font-bold lg:table-cell">
						{#if row.closed}
							<Span>Resort Closed</Span>
						{:else}
							{row.runs_open} / {row.total_runs}
						{/if}
					</TableBodyCell>
					<TableBodyCell class="px-3 py-4 text-center font-bold">
						{#if row.closed}
							<Span>--</Span>
						{:else}
							{formatSnowfall(row.snow_past_24h)}
						{/if}
					</TableBodyCell>
					<TableBodyCell class="hidden py-4 text-center font-bold md:table-cell md:px-3"
						>{formatSnowfall(row.snow_next_24h)}</TableBodyCell
					>
					<TableBodyCell class="hidden py-4 text-center font-bold md:table-cell md:px-3"
						>{formatSnowfall(row.snow_next_72h)}</TableBodyCell
					>
					<TableBodyCell class="!px-0 py-4 text-center font-bold md:px-3">
						{#if isFavorite(row)}
							<EditAlertButton
								size="sm"
								{session}
								alertData={alerts?.find((alert) => alert.mountain_id === row.mountain_id)}
							/>
						{:else}
							<AddAlertButton
								size="sm"
								{session}
								mountainID={row.mountain_id}
								displayName={row.display_name}
							/>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
	a:hover span {
		text-decoration: underline;
	}
	a:hover p {
		display: inline-block;
		text-decoration: none;
	}
</style>

<script lang="ts">
	import AddAlertButton from '$lib/components/AddAlertButton.svelte';
	import EditAlertButton from '$lib/components/EditAlertButton.svelte';
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
	import { avalancheDangerRatingsMap, formatSnowfall } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import {
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
	export let alerts: UserAlerts[];
	export let backcountryOverviews: BackcountryOverview[];

	// Component variables
	const handler = new DataHandler<BackcountryOverview>(backcountryOverviews);
	const rows = handler.getRows();

	// Component state
	$: mappedAlerts = alerts.map((alert) => alert.mountain_id);

	// Handlers and functions
	handler.onChange((state: State) => reload(state));
	handler.sortAsc('display_name');

	$: isFavorite = (mountain: BackcountryOverview) => mappedAlerts.includes(mountain.mountain_id);
</script>

<div class="space-y-4">
	<header class="flex justify-between px-2">
		<Search {handler} />
	</header>
	<Table
		divClass="relative overflow-x-hidden sm:overflow-x-auto border dark:border-surface-700 rounded-lg"
	>
		<caption class="sr-only"
			>Snow and weather conditions for CO backcountry areas. Column headers are sortable. Switch
			between categories with the tabs above.</caption
		>
		<TableHead class="dark:bg-surface-800">
			<ThSort {handler} orderBy="display_name"><Span class="font-bold">Location</Span></ThSort>
			<ThSort {handler} orderBy="overall_danger_level" center>
				<Span class="font-bold lg:before:content-['Avalanche_']">Danger</Span>
			</ThSort>
			<ThSort {handler} orderBy="snow_past_7d" classes="hidden md:px-3 py-4 md:table-cell" center
				><Span class="font-bold">Last Week</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_past_24h" center
				><Span class="font-bold sm:before:content-['Last_']">24h</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_next_24h" classes="hidden md:px-3 py-4 md:table-cell" center
				><Span class="font-bold">Next 24h</Span></ThSort
			>
			<ThSort {handler} orderBy="snow_next_72h" classes="hidden lg:px-3 py-4 lg:table-cell" center
				><Span class="font-bold">Next 72h</Span></ThSort
			>
			<TableHeadCell class="px-4 py-4" aria-hidden></TableHeadCell>
		</TableHead>
		<TableBody>
			{#if !$rows.length}
				<TableBodyRow class="w-full text-center dark:border-surface-700 dark:bg-surface-900">
					<TableBodyCell class="w-full" colspan="7">
						<div class="flex w-full flex-col items-center justify-center gap-4">
							<p class="text-base">No results found</p>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#each $rows as row}
				<TableBodyRow class="border-b dark:border-surface-700 dark:bg-surface-900">
					<TableBodyCell class="p-0">
						<a
							class="flex flex-col gap-1 px-2 py-4 dark:text-primary-300 sm:px-3"
							href="/snow-report/backcountry/{row.slug}"
							data-sveltekit-preload-data="hover"
							><span class="text-primary-700 dark:text-primary-300 xl:text-lg"
								>{row.display_name}</span
							>
							<p class="text-xs text-surface-600 dark:text-surface-500">
								{row.state} | {row.region}
							</p>
						</a>
					</TableBodyCell>
					<TableBodyCell class="p-0 text-center font-semibold sm:px-3 sm:font-bold">
						<div class="inline-flex items-center justify-center px-1 py-4">
							<span class="sm:p-2"
								><AvalancheDangerIcon dangerLevel={row.overall_danger_level} size="40px" /></span
							>
							<span class="hidden sm:inline"
								>{avalancheDangerRatingsMap[row.overall_danger_level]}</span
							>
						</div></TableBodyCell
					>
					<TableBodyCell class=" hidden px-3 py-4 text-center font-bold md:table-cell"
						>{formatSnowfall(row.snow_past_7d)}</TableBodyCell
					>
					<TableBodyCell class="px-3 py-4 text-center font-bold"
						>{formatSnowfall(row.snow_past_24h)}</TableBodyCell
					>
					<TableBodyCell class=" hidden px-3 py-4 text-center font-bold md:table-cell"
						>{formatSnowfall(row.snow_next_24h)}</TableBodyCell
					>
					<TableBodyCell class=" hidden px-3 py-4 text-center font-bold lg:table-cell"
						>{formatSnowfall(row.snow_next_72h)}</TableBodyCell
					>
					<TableBodyCell class="px-0 py-4 sm:text-center md:px-3">
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

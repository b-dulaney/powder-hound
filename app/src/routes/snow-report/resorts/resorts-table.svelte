<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import FilterDropdown from '$lib/components/datatable/FilterDropdown.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
	import { formatSnowfall } from '$lib/utils';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { reload } from './api';
	import {
		A,
		Button,
		Card,
		Label,
		Modal,
		P,
		Select,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { addToast, type ToastSettings } from '$lib/components/toasts';

	// Props
	export let session: Session | null;
	export let resortOverviews: ResortOverview[];
	export let alerts: UserAlerts[];

	// Component variables
	const handler = new DataHandler<ResortOverview>(resortOverviews);
	const rows = handler.getRows();
	let showModal = false;
	let selectedMountain: ResortOverview | null;
	let selectedThresholdInches = 1;

	let showClosed = false;
	const updateSuccessToast: ToastSettings = {
		type: 'success',
		message: 'Alert(s) updated successfully.',
		timeout: 3000
	};

	const failureToast: ToastSettings = {
		type: 'error',
		message: 'Action failed. Please try again.',
		timeout: 5000
	};

	const deleteSuccessToast: ToastSettings = {
		type: 'delete',
		message: 'Alert deleted successfully.',
		timeout: 3000
	};

	// Component state
	$: alerts = alerts;
	$: mappedAlerts = alerts.map((alert) => alert.mountain_id);

	// Handlers and functions
	handler.sortAsc('display_name');
	handler.filter('false', 'closed');
	handler.onChange((state: State) => reload(state));

	$: isFavorite = (mountain: ResortOverview) => mappedAlerts.includes(mountain.mountain_id);

	async function deleteAlert(mountain: ResortOverview) {
		const alertId = alerts.find((a) => a.mountain_id === mountain.mountain_id)?.id;
		if (!alertId) return;

		const response = await fetch(`/api/alerts/${alertId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				mountain_id: mountain.mountain_id,
				user_id: session?.user.id
			})
		});
		if (response.ok) {
			mappedAlerts = mappedAlerts.filter((id) => id !== mountain.mountain_id);
			addToast(deleteSuccessToast);
			invalidate('update:alerts');
		} else {
			addToast(failureToast);
		}
	}

	const handleAlertClick = (mountain: ResortOverview) => {
		if (session) {
			if (isFavorite(mountain)) {
				deleteAlert(mountain);
			} else {
				selectedMountain = mountain;
				showModal = true;
			}
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	};

	async function handleSave() {
		const body = {
			mountain_id: selectedMountain?.mountain_id,
			display_name: selectedMountain?.display_name,
			threshold_inches: selectedThresholdInches,
			user_id: session?.user.id,
			email: session?.user.email,
			paused: false
		};
		const response = await fetch(`/api/alerts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (response.ok) {
			mappedAlerts = [...mappedAlerts, selectedMountain!.mountain_id];
			selectedMountain = null;
			selectedThresholdInches = 1;
			addToast(updateSuccessToast);
			invalidate('update:alerts');
		} else {
			addToast(failureToast);
		}
	}

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
								{row.region}
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
					<TableBodyCell class="!px-0 py-4 font-bold sm:text-center">
						{#if isFavorite(row)}
							<button
								type="button"
								title="Remove alert"
								aria-label="Remove alert"
								class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0 hover:scale-125"
								on:click={() => handleAlertClick(row)}
							>
								<i class="fa-solid fa-bell text-yellow-400"></i>
							</button>
						{:else}
							<button
								type="button"
								title="Add alert"
								aria-label="Add alert"
								class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0 hover:scale-125"
								on:click={() => handleAlertClick(row)}
							>
								<i class="fa-regular fa-bell"></i>
							</button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<Modal
	bind:open={showModal}
	size="xs"
	title="Add alert"
	autoclose
	outsideclose
	classHeader="text-surface-700 dark:text-white"
>
	<P>Select the snowfall threshold that you'll receive alerts for.</P>
	<div class="flex items-center justify-between gap-2 py-6">
		<P>{selectedMountain?.display_name}</P>
		<Label class="inline-flex items-center gap-4">
			<Span class="hidden font-medium sm:block">Snowfall</Span>
			<Select
				size="sm"
				placeholder="Select a threshold"
				class="w-24"
				bind:value={selectedThresholdInches}
			>
				<option value={1}>1+ in</option>
				<option value={3}>3+ in</option>
				<option value={6}>6+ in</option>
				<option value={12}>12+ in</option>
			</Select>
		</Label>
	</div>
	<div class="flex w-full justify-end">
		<Button color="alternative">Cancel</Button>
		<Button class="ms-2" on:click={handleSave}>Save</Button>
	</div>
</Modal>

<style>
	a:hover span {
		text-decoration: underline;
	}
	a:hover p {
		display: inline-block;
		text-decoration: none;
	}
</style>

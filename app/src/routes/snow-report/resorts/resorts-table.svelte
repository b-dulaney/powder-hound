<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import FilterDropdown from '$lib/components/datatable/FilterDropdown.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
	import { formatSnowfall } from '$lib/utils';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { selectedMountain } from '../stores';
	import { reload } from './api';
	import {
		A,
		Button,
		Card,
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
	const modalStore = getModalStore();

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
				selectedMountain.set(mountain);

				new Promise<boolean>((resolve) => {
					const alertModal: ModalSettings = {
						type: 'component',
						title: 'Add Alert',
						component: 'alertModal',
						meta: {
							user_id: session?.user.id,
							email: session?.user.email
						},
						response: (r: any) => {
							resolve(r);
						}
					};
					modalStore.trigger(alertModal);
				}).then(async (r: any) => {
					if (r.success) {
						mappedAlerts = [...mappedAlerts, mountain.mountain_id];
						addToast(updateSuccessToast);
						invalidate('update:alerts');
					} else if (r.error) {
						addToast(failureToast);
					}
				});
			}
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	};

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
	<Table>
		<caption class="sr-only"
			>Snow and weather conditions for CO ski resorts. Column headers are sortable. Switch between
			categories with the tabs above.</caption
		>
		<TableHead class="dark:bg-surface-900">
			<ThSort {handler} orderBy="display_name">Location</ThSort>
			<ThSort {handler} orderBy="base_depth" center
				><span class="sm:after:content-['_Depth']">Base</span></ThSort
			>
			<ThSort {handler} orderBy="runs_open" classes="hidden lg:px-3 py-4 lg:table-cell" center
				>Runs Open</ThSort
			>
			<ThSort {handler} orderBy="snow_past_24h" center
				><span class="sm:before:content-['Last_']">24h</span></ThSort
			>
			<ThSort {handler} orderBy="snow_next_24h" classes="hidden md:px-3 py-4 md:table-cell" center
				>Next 24h</ThSort
			>
			<ThSort {handler} orderBy="snow_next_72h" classes="hidden md:px-3 py-4 md:table-cell" center
				>Next 72h</ThSort
			>
			<TableHeadCell aria-hidden></TableHeadCell>
		</TableHead>
		<TableBody>
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
				<TableBodyRow
					class="border-b dark:border-b-surface-800 dark:odd:bg-surface-950 dark:even:bg-surface-900"
				>
					<TableBodyCell class="px-3 py-4"
						><A
							class="dark:text-primary-300 md:pl-2 xl:text-lg"
							href="/snow-report/resorts/{row.slug}"
							data-sveltekit-preload-data="hover">{row.display_name}</A
						></TableBodyCell
					>
					<TableBodyCell class="px-3 py-4 text-center font-bold"
						>{row.closed ? '--' : formatSnowfall(row.base_depth)}</TableBodyCell
					>
					<TableBodyCell class="hidden px-3 py-4 text-center font-bold lg:block">
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

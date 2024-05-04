<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import { addToast, type ToastSettings } from '$lib/components/toasts';
	import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
	import { avalancheDangerRatingsMap, formatSnowfall } from '$lib/utils';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import {
		A,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { selectedMountain } from '../stores';
	import { reload } from './api';

	// Props
	export let session: Session | null;
	export let alerts: UserAlerts[];
	export let backcountryOverviews: BackcountryOverview[];

	// Component variables
	const handler = new DataHandler<BackcountryOverview>(backcountryOverviews);
	const rows = handler.getRows();
	const modalStore = getModalStore();

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
	handler.onChange((state: State) => reload(state));
	handler.sortAsc('display_name');

	$: isFavorite = (mountain: BackcountryOverview) => mappedAlerts.includes(mountain.mountain_id);

	async function deleteAlert(mountain: BackcountryOverview) {
		const alertId = alerts.find((a) => a.mountain_id === mountain.mountain_id)?.id;
		if (!alertId) return;

		const response = await fetch(`/api/alerts/${alertId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			mappedAlerts = mappedAlerts.filter((id) => id !== mountain.mountain_id);
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
		}
	}

	const handleAlertClick = (mountain: BackcountryOverview) => {
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
</script>

<div class="space-y-4">
	<header class="flex justify-between px-2">
		<Search {handler} />
	</header>
	<Table>
		<caption class="sr-only"
			>Snow and weather conditions for CO backcountry areas. Column headers are sortable. Switch
			between categories with the tabs above.</caption
		>
		<TableHead class="dark:bg-surface-900">
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
				<TableBodyRow class="w-full text-center dark:bg-surface-800">
					<TableBodyCell class="w-full" colspan="7">
						<div class="flex w-full flex-col items-center justify-center gap-4">
							<p class="text-base">No results found</p>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
			{#each $rows as row}
				<TableBodyRow
					class="border-b dark:border-b-surface-800 dark:odd:bg-surface-950 dark:even:bg-surface-900"
				>
					<TableBodyCell class="px-1 py-4 sm:px-3">
						<A
							class="dark:text-primary-300 sm:pl-2 xl:text-lg"
							href="/snow-report/backcountry/{row.slug}"
							data-sveltekit-preload-data="hover">{row.display_name}</A
						>
					</TableBodyCell>
					<TableBodyCell class="px-3 py-4 text-center font-semibold sm:font-bold">
						<div class="flex items-center justify-center">
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
							<button
								type="button"
								title="Remove alert"
								aria-label="Remove alert"
								class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0 hover:scale-125"
								on:click={() => handleAlertClick(row)}
							>
								<i class="fa-solid fa-bell text-yellow-500"></i>
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

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import FilterDropdown from '$lib/components/datatable/FilterDropdown.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { ResortOverview, UserAlerts } from '$lib/supabase.types';
	import {
		addAlertFailedToast,
		addAlertSuccessfulToast,
		deleteAlertFailedToast,
		deleteAlertSuccessfulToast,
		formatSnowfall
	} from '$lib/utils';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { selectedMountain } from '../stores';
	import { reload } from './api';
	export let session: Session | null;
	export let resortOverviews: ResortOverview[];
	export let alerts: UserAlerts[];
	let showClosed = false;

	const handler = new DataHandler<ResortOverview>(resortOverviews);
	const rows = handler.getRows();
	handler.sortAsc('display_name');
	handler.filter('false', 'closed');
	handler.onChange((state: State) => reload(state));

	$: mappedAlerts = alerts.map((alert) => alert.mountain_id);

	const modalStore = getModalStore();
	const toastStore = getToastStore();

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
			toastStore.trigger(deleteAlertSuccessfulToast);
			invalidate('update:alerts');
		} else {
			toastStore.trigger(deleteAlertFailedToast);
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
						toastStore.trigger(addAlertSuccessfulToast);
						invalidate('update:alerts');
					} else if (r.error) {
						toastStore.trigger(addAlertFailedToast);
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
	<div class="table-container">
		<table class="table">
			<caption class="sr-only"
				>Snow and weather conditions for CO ski resorts. Column headers are sortable. Switch between
				categories with the tabs above.</caption
			>
			<thead class="w-full">
				<tr>
					<ThSort {handler} orderBy="display_name" classes="table-cell-fit">Location</ThSort>
					<ThSort {handler} orderBy="snow_past_24h" classes="table-cell-fit" center
						><span class="sm:before:content-['Last_']">24h</span></ThSort
					>
					<ThSort
						{handler}
						orderBy="snow_next_24h"
						classes="hidden md:table-cell-fit md:table-cell"
						center>Next 24h</ThSort
					>
					<ThSort
						{handler}
						orderBy="snow_next_72h"
						classes="hidden md:table-cell-fit md:table-cell"
						center>Next 72h</ThSort
					>
					<ThSort {handler} orderBy="base_depth" classes="table-cell-fit" center
						><span class="sm:after:content-['_Depth']">Base</span></ThSort
					>
					<ThSort
						{handler}
						orderBy="runs_open"
						classes="hidden lg:table-cell-fit lg:table-cell"
						center>Runs Open</ThSort
					>
					<th class="table-cell-fit"></th>
				</tr>
			</thead>
			<tbody>
				{#if !$rows.length}
					<tr class="w-full text-center">
						<td class="table-cell w-full" colspan="7">
							<div class="flex w-full flex-col items-center justify-center gap-4">
								<p class="text-base">No results found</p>
								{#if showClosed === false}
									<button class="variant-ghost-primary btn btn-sm" on:click={handleClickShowClosed}
										>Show Closed Resorts
									</button>
								{/if}
							</div>
						</td>
					</tr>
				{/if}
				{#each $rows as row}
					<tr>
						<td class="table-cell-fit"
							><a
								class="anchor text-primary-500-400-token md:pl-2 xl:text-lg"
								href="/snow-report/resorts/{row.slug}"
								data-sveltekit-preload-data="hover">{row.display_name}</a
							></td
						>
						<td class="table-cell-fit text-center font-bold">{formatSnowfall(row.snow_past_24h)}</td
						>
						<td class="hidden text-center font-bold md:table-cell-fit md:table-cell"
							>{formatSnowfall(row.snow_next_24h)}</td
						>
						<td class="hidden text-center font-bold md:table-cell-fit md:table-cell"
							>{formatSnowfall(row.snow_next_72h)}</td
						>
						<td class="table-cell-fit text-center font-bold">{formatSnowfall(row.base_depth)}</td>
						<td class="hidden text-center font-bold lg:table-cell-fit lg:table-cell"
							>{row.runs_open} / {row.total_runs}</td
						>
						<td class="table-cell-fit !px-0 sm:text-center">
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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

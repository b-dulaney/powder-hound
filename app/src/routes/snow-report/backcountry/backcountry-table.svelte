<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import type { BackcountryOverview, UserAlerts } from '$lib/supabase.types';
	import {
		addAlertFailedToast,
		addAlertSuccessfulToast,
		avalancheDangerRatingsMap,
		deleteAlertFailedToast,
		deleteAlertSuccessfulToast,
		formatSnowfall
	} from '$lib/utils';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { selectedMountain } from '../stores';
	import { page } from '$app/stores';
	import { DataHandler, type State } from '@vincjo/datatables/remote';
	import { reload } from './api';
	export let session: Session | null;
	export let alerts: UserAlerts[];
	export let backcountryOverviews: BackcountryOverview[];

	const handler = new DataHandler<BackcountryOverview>(backcountryOverviews);
	const rows = handler.getRows();
	handler.sortAsc('display_name');
	handler.onChange((state: State) => reload(state));

	$: mappedAlerts = alerts.map((alert) => alert.mountain_id);

	const modalStore = getModalStore();
	const toastStore = getToastStore();

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
			toastStore.trigger(deleteAlertSuccessfulToast);
		} else {
			toastStore.trigger(deleteAlertFailedToast);
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
</script>

<div class="space-y-4">
	<header class="flex justify-between px-2">
		<Search {handler} />
	</header>
	<div class="table-container">
		<table class="table">
			<caption class="sr-only"
				>Snow and weather conditions for CO backcountry areas. Column headers are sortable. Switch
				between categories with the tabs above.</caption
			>
			<thead class="w-full">
				<tr>
					<ThSort {handler} orderBy="display_name" classes="table-cell-fit">Location</ThSort>
					<ThSort {handler} orderBy="overall_danger_level" classes="table-cell-fit" center>
						<span class="sm:before:content-['Avalanche_']">Danger</span>
					</ThSort>
					<ThSort
						{handler}
						orderBy="snow_past_7d"
						classes="hidden md:table-cell-fit md:table-cell"
						center>Last Week</ThSort
					>
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
						classes="hidden lg:table-cell-fit lg:table-cell"
						center>Next 72h</ThSort
					>
					<th class="table-cell-fit" aria-hidden></th>
				</tr>
			</thead>
			<tbody>
				{#if !$rows.length}
					<tr class="w-full text-center">
						<td class="table-cell w-full" colspan="7">
							<div class="flex w-full flex-col items-center justify-center gap-4">
								<p class="text-base">No results found</p>
							</div>
						</td>
					</tr>
				{/if}
				{#each $rows as row}
					<tr>
						<td class="table-cell-fit !align-middle">
							<a
								class="anchor text-primary-500-400-token whitespace-nowrap md:pl-2 xl:text-lg"
								href="/snow-report/backcountry/{row.slug}"
								data-sveltekit-preload-data="hover">{row.display_name}</a
							>
						</td>
						<td class="table-cell-fit text-center !align-middle font-semibold sm:font-bold">
							<div class="flex items-center justify-center">
								<span class="sm:p-2"
									><AvalancheDangerIcon dangerLevel={row.overall_danger_level} size="40px" /></span
								>
								<span class="hidden sm:inline"
									>{avalancheDangerRatingsMap[row.overall_danger_level]}</span
								>
							</div></td
						>
						<td class="hidden text-center !align-middle font-bold md:table-cell-fit md:table-cell"
							>{formatSnowfall(row.snow_past_7d)}</td
						>
						<td class="text-center !align-middle font-bold">{formatSnowfall(row.snow_past_24h)}</td>
						<td class="hidden text-center !align-middle font-bold md:table-cell-fit md:table-cell"
							>{formatSnowfall(row.snow_next_24h)}</td
						>
						<td class="hidden text-center !align-middle font-bold lg:table-cell-fit lg:table-cell"
							>{formatSnowfall(row.snow_next_72h)}</td
						>
						<td class="table-cell-fit !px-0 !align-middle sm:text-center">
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

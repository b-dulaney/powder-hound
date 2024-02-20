<script lang="ts">
	import WeatherIcon from "$lib/components/weather-icon.svelte";
	import type { ResortOverview, UserAlerts } from "$lib/supabase.types";
	import { formatSnowfall } from "$lib/utils";
	import type { Session } from "@supabase/supabase-js";
    import { resortSearchInput, resortColumnSort, selectedMountain } from "../stores";
    import { getModalStore, getToastStore, type ModalSettings, type ToastSettings } from "@skeletonlabs/skeleton";
	import { goto, invalidate, invalidateAll } from "$app/navigation";
    export let session: Session | null;
    export let resortOverviews: ResortOverview[];
    export let alerts: UserAlerts[];
    $: mappedAlerts = alerts.map((alert) => alert.mountain_id);

    const modalStore = getModalStore();
    const toastStore = getToastStore();

    const addSuccessfulToast: ToastSettings = {
        timeout: 2000,
        message: 'Alert added successfully.',
        background: 'variant-filled-secondary'
    }

    const deleteSuccessfulToast: ToastSettings = {
        timeout: 2000,
        message: 'Alert disabled successfully.',
        background: 'variant-filled-tertiary'
    }

    const deleteFailedToast: ToastSettings = {
        timeout: 3000,
        message: 'Failed to disable alert. Please try again.',
        background: 'variant-filled-error'
    }

    const addFailedToast: ToastSettings = {
        timeout: 3000,
        message: 'Failed to add alert. Please try again.',
        background: 'variant-filled-error'
    }

    $: isFavorite = (mountain: ResortOverview) => mappedAlerts.includes(mountain.mountain_id);

    async function deleteAlert(mountain: ResortOverview) {
        const alertId = alerts.find((a) => a.mountain_id === mountain.mountain_id)?.id;
        if(!alertId) return;
        
        const response = await fetch(`/api/alerts/${alertId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mountain_id: mountain.mountain_id,
                user_id: session?.user.id,
            }),
        });
        if (response.ok) {
            mappedAlerts = mappedAlerts.filter((id) => id !== mountain.mountain_id);
            toastStore.trigger(deleteSuccessfulToast);
            invalidate('update:alerts');
        } else {
            toastStore.trigger(deleteFailedToast);
        }
    }

    const handleAlertClick = (mountain: ResortOverview) => {
        if(session){
            if(isFavorite(mountain)){
            deleteAlert(mountain)
        } else {
            selectedMountain.set(mountain);
            
            new Promise<boolean>((resolve) => {
                const alertModal: ModalSettings = {
                    type: 'component',
                    title: 'Set Alert',
                    component: 'alertModal',
                    meta: {
                        user_id: session?.user.id,
                        email: session?.user.email,
                    },
                    response: (r: any) => {
                        resolve(r);
                    },
                }
                modalStore.trigger(alertModal);
            }).then(async (r: any) => {
                if(r.success){
                    mappedAlerts = [...mappedAlerts, mountain.mountain_id];
                    toastStore.trigger(addSuccessfulToast);
                    invalidate('update:alerts');
                } else if(r.error) {
                    toastStore.trigger(addFailedToast);
                }
            });
	
        }
        } else {
            goto('/login')
        }
    }

    const updateColumnSort = (sortBy: string) => {
		if ($resortColumnSort.name === sortBy) {
			$resortColumnSort.asc = !$resortColumnSort.asc;
		} else if (sortBy === 'location') {
			$resortColumnSort.name = sortBy;
			$resortColumnSort.asc = true;
		} else {
			$resortColumnSort.name = sortBy;
			$resortColumnSort.asc = false;
		}
		sortLocations($resortColumnSort.name, $resortColumnSort.asc);
	};

	const sortLocations = (sortBy: string, asc: boolean) => {
		const sortOrder = asc ? 1 : -1;

		resortOverviews =
        resortOverviews.sort((a, b) => {
				switch (sortBy) {
					case 'location':
						return a.display_name > b.display_name ? sortOrder : -sortOrder;
                    case 'baseDepth':
                        return (a.base_depth - b.base_depth) * sortOrder;
                    case 'runsOpen':
                        return ((a.runs_open / a.total_runs) - (b.runs_open / b.total_runs)) * sortOrder;
                    case 'last48hours':
                        return (a.snow_past_48h - b.snow_past_48h) * sortOrder;
					case 'last24hours':
						return (a.snow_past_24h - b.snow_past_24h) * sortOrder;
					case 'next24hours':
						return (a.snow_next_24h - b.snow_next_24h) * sortOrder;
                    case 'next72hours':
                        return (a.snow_next_72h - b.snow_next_72h) * sortOrder;

					default:
						return a.display_name > b.display_name ? sortOrder : -sortOrder;
				}
			}) || [];

	};
    
    sortLocations($resortColumnSort.name, $resortColumnSort.asc);

</script>

<div class="py-4 flex w-full items-center justify-center">
    <div
        class="input-group input-group-divider w-3/4 grid-cols-[auto_1fr_auto] sm:w-2/3 lg:w-1/2 2xl:w-1/3"
    >
        <div class="input-group-shim"><i class="fa-solid fa-magnifying-glass"></i></div>
        <input
            type="search"
            autocomplete="off"
            placeholder="Search..."
            bind:value={$resortSearchInput}
        />
    </div>
</div>

<div class="table-container">
    <table class="table">
        <caption class="sr-only"
            >Snow and weather conditions for CO resorts and backcountry areas, column headers with
            buttons are sortable. Switch between categories with the tabs above.</caption
        >
        <thead class="w-full">
            <tr>
                <th
                    class="table-cell-fit"
                    aria-sort={$resortColumnSort.name === 'location'
                        ? $resortColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group md:pl-1" on:click={() => updateColumnSort('location')}>
                        Location
                        <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'location'}>
                            {#if $resortColumnSort.name === 'location' && $resortColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $resortColumnSort.name === 'location' && !$resortColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                class="hidden lg:table-cell-fit lg:table-cell lg:text-center"
                aria-sort={$resortColumnSort.name === 'baseDepth'
                    ? $resortColumnSort.asc
                        ? 'ascending'
                        : 'descending'
                    : 'none'}
            >
                <button class="group" on:click={() => updateColumnSort('baseDepth')}>
                    Base Depth
                    <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'baseDepth'}>
                        {#if $resortColumnSort.name === 'baseDepth' && $resortColumnSort.asc}
                            <i class="fa-solid fa-sort-up"></i>
                        {:else if $resortColumnSort.name === 'baseDepth' && !$resortColumnSort.asc}
                            <i class="fa-solid fa-sort-down"></i>
                        {:else}
                            <i class="fa-solid fa-sort opacity-25"></i>
                        {/if}
                    </span>
                </button>
                </th>
                <th
                class="hidden lg:table-cell-fit lg:table-cell lg:text-center"
                aria-sort={$resortColumnSort.name === 'runsOpen'
                    ? $resortColumnSort.asc
                        ? 'ascending'
                        : 'descending'
                    : 'none'}
            >
                <button class="group" on:click={() => updateColumnSort('runsOpen')}>
                    Runs Open
                    <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'runsOpen'}>
                        {#if $resortColumnSort.name === 'runsOpen' && $resortColumnSort.asc}
                            <i class="fa-solid fa-sort-up"></i>
                        {:else if $resortColumnSort.name === 'runsOpen' && !$resortColumnSort.asc}
                            <i class="fa-solid fa-sort-down"></i>
                        {:else}
                            <i class="fa-solid fa-sort opacity-25"></i>
                        {/if}
                    </span>
                </button>
                </th>
                <th
                    class="hidden md:table-cell-fit md:table-cell md:text-center"
                    aria-sort={$resortColumnSort.name === 'last48hours'
                        ? $resortColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('last48hours')}>
                        Last 48H
                        <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'last48hours'}>
                            {#if $resortColumnSort.name === 'last48hours' && $resortColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $resortColumnSort.name === 'last48hours' && !$resortColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="table-cell-fit !px-1 text-center"
                    aria-sort={$resortColumnSort.name === 'last24hours'
                        ? $resortColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('last24hours')}>
                        Last 24H
                        <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'last24hours'}>
                            {#if $resortColumnSort.name === 'last24hours' && $resortColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $resortColumnSort.name === 'last24hours' && !$resortColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="table-cell-fit !pl-2 !pr-0 text-center"
                    aria-sort={$resortColumnSort.name === 'next24hours'
                        ? $resortColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('next24hours')}>
                        Next 24H
                        <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'next24hours'}>
                            {#if $resortColumnSort.name === 'next24hours' && $resortColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $resortColumnSort.name === 'next24hours' && !$resortColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                class="hidden md:table-cell-fit md:table-cell md:text-center"
                aria-sort={$resortColumnSort.name === 'next72hours'
                    ? $resortColumnSort.asc
                        ? 'ascending'
                        : 'descending'
                    : 'none'}
            >
                <button class="group" on:click={() => updateColumnSort('next72hours')}>
                    Next 72H
                    <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'next72hours'}>
                        {#if $resortColumnSort.name === 'next72hours' && $resortColumnSort.asc}
                            <i class="fa-solid fa-sort-up"></i>
                        {:else if $resortColumnSort.name === 'next72hours' && !$resortColumnSort.asc}
                            <i class="fa-solid fa-sort-down"></i>
                        {:else}
                            <i class="fa-solid fa-sort opacity-25"></i>
                        {/if}
                    </span>
                </button>
            </th>
                <th class="!px-0 sm:table-cell-fit" aria-hidden></th>
            </tr>
        </thead>
        <tbody>
            {#if resortOverviews.length === 0}
                <tr>
                    <td colspan="8">
                        <div class="m-4 flex justify-center">
                            <h3 class="h3">No results found</h3>
                        </div>
                    </td>
                </tr>
                
            {:else}
                {#each resortOverviews as row, i}
                    <tr>
                        <td class="table-cell-fit"
                            ><a
                                class="anchor text-primary-500-400-token xl:text-lg md:pl-2"
                                href="/snow-report/resorts/{row.slug}"
                                data-sveltekit-preload-data="hover">{row.display_name}</a
                            ></td
                        >
                        <td class="hidden font-bold lg:table-cell-fit lg:table-cell lg:text-center"
                            >{row.base_depth}”</td>
                        <td class="hidden font-bold lg:table-cell-fit lg:table-cell lg:text-center"
                            >{Math.floor((row.runs_open / row.total_runs) * 100)}%</td>
                        <td class="hidden font-bold md:table-cell-fit md:table-cell md:text-center"
                        >{formatSnowfall(row.snow_past_48h)}"</td
                    >
                        <td class="text-center font-bold">{formatSnowfall(row.snow_past_24h)}"</td>
                        <td class="text-center font-bold">{formatSnowfall(row.snow_next_24h)}"</td>
                        <td class="hidden font-bold md:table-cell-fit md:table-cell md:text-center"
                        >{formatSnowfall(row.snow_next_72h)}"</td
                    >
                        <td class="!px-0 text-center font-bold">
                            {#if isFavorite(row)}
                            <button type="button" title="Remove alert" aria-label="Remove alert" class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0 hover:scale-125" on:click={() => handleAlertClick(row)}>
                                <i class="fa-solid fa-bell text-yellow-500"></i>
                            </button>
                            {:else}
                            <button type="button" title="Add alert" aria-label="Add alert" class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0 hover:scale-125" on:click={() => handleAlertClick(row)}>
                                <i class="fa-regular fa-bell"></i>
                            </button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
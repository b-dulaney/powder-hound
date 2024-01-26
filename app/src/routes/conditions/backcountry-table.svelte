<script lang="ts">
	import AvalancheDangerIcon from "$lib/components/avalanche-danger-icon.svelte";
    import WeatherIcon from "$lib/components/weather-icon.svelte";
	import type { BackcountryOverview } from "$lib/supabase.types";
	import { formatSnowfall, avalancheDangerRatingsMap } from "$lib/utils";
	import { backcountrySearchInput, backcountryColumnSort } from "./stores";
    export let favorites: number[];
    export let backcountryOverviews: BackcountryOverview[];

    const isFavorite = (mountain: BackcountryOverview) => favorites.includes(mountain.mountain_id);

    $: if(backcountryOverviews.length > 0) {
        sortLocations($backcountryColumnSort.name, $backcountryColumnSort.asc);
    }

    const updateColumnSort = (sortBy: string) => {
		if ($backcountryColumnSort.name === sortBy) {
			$backcountryColumnSort.asc = !$backcountryColumnSort.asc;
		} else if (sortBy === 'location') {
			$backcountryColumnSort.name = sortBy;
			$backcountryColumnSort.asc = true;
		} else {
			$backcountryColumnSort.name = sortBy;
			$backcountryColumnSort.asc = false;
		}
		sortLocations($backcountryColumnSort.name, $backcountryColumnSort.asc);
	};

	const sortLocations = (sortBy: string, asc: boolean) => {
		const sortOrder = asc ? 1 : -1;

		backcountryOverviews =
        backcountryOverviews.sort((a, b) => {
				switch (sortBy) {
					case 'location':
						return a.display_name > b.display_name ? sortOrder : -sortOrder;
					case 'weather':
						return (a.current_temp - b.current_temp) * sortOrder;
                    case 'danger':
                        return (a.overall_danger_level - b.overall_danger_level) * sortOrder;
					case 'last7days':
						return (a.snow_past_7d - b.snow_past_7d) * sortOrder;
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

    backcountryColumnSort.subscribe((value) => {
        sortLocations(value.name, value.asc);
    });

    $: if(backcountryOverviews.length > 0) {
        sortLocations($backcountryColumnSort.name, $backcountryColumnSort.asc);
    }


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
            bind:value={$backcountrySearchInput}
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
                    aria-sort={$backcountryColumnSort.name === 'location'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('location')}>
                        Location
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'location'}>
                            {#if $backcountryColumnSort.name === 'location' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'location' && !$backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                class="hidden sm:table-cell-fit sm:table-cell sm:text-center"
                aria-sort={$backcountryColumnSort.name === 'danger'
                    ? $backcountryColumnSort.asc
                        ? 'ascending'
                        : 'descending'
                    : 'none'}
            >
                <button class="group" on:click={() => updateColumnSort('danger')}>
                    Avalanche Danger
                    <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'danger'}>
                        {#if $backcountryColumnSort.name === 'danger' && $backcountryColumnSort.asc}
                            <i class="fa-solid fa-sort-up"></i>
                        {:else if $backcountryColumnSort.name === 'danger' && !$backcountryColumnSort.asc}
                            <i class="fa-solid fa-sort-down"></i>
                        {:else}
                            <i class="fa-solid fa-sort opacity-25"></i>
                        {/if}
                    </span>
                </button>
            </th>
                <th
                    class="hidden lg:table-cell-fit lg:table-cell lg:text-center"
                    aria-sort={$backcountryColumnSort.name === 'weather'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('weather')}>
                        Weather
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'weather'}>
                            {#if $backcountryColumnSort.name === 'weather' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'weather' && !$backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="hidden lg:table-cell-fit lg:table-cell lg:text-center"
                    aria-sort={$backcountryColumnSort.name === 'last7days'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('last7days')}>
                        Last 7 Days
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'last7days'}>
                            {#if $backcountryColumnSort.name === 'last7days' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'last7days' && !$backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="table-cell-fit !px-1 text-center"
                    aria-sort={$backcountryColumnSort.name === 'last24hours'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('last24hours')}>
                        Last 24H
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'last24hours'}>
                            {#if $backcountryColumnSort.name === 'last24hours' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'last24hours' && !$backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="table-cell-fit !pl-2 !pr-0 text-center"
                    aria-sort={$backcountryColumnSort.name === 'next24hours'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('next24hours')}>
                        Next 24H
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'next24hours'}>
                            {#if $backcountryColumnSort.name === 'next24hours' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'next24hours' && !$backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-down"></i>
                            {:else}
                                <i class="fa-solid fa-sort opacity-25"></i>
                            {/if}
                        </span>
                    </button>
                </th>
                <th
                    class="hidden md:table-cell-fit md:table-cell md:text-center"
                    aria-sort={$backcountryColumnSort.name === 'next72hours'
                        ? $backcountryColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('next72hours')}>
                        Next 72H
                        <span class="pl-1" aria-hidden={$backcountryColumnSort.name !== 'next72hours'}>
                            {#if $backcountryColumnSort.name === 'next72hours' && $backcountryColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $backcountryColumnSort.name === 'next72hours' && !$backcountryColumnSort.asc}
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
            {#if backcountryOverviews.length === 0}
                <tr>
                    <td colspan="8">
                        <div class="m-4 flex justify-center">
                            <h3 class="h3">No results found</h3>
                        </div>
                    </td>
                </tr>
                
            {:else}
                {#each backcountryOverviews as row, i}
                    <tr>
                        <td class="table-cell-fit !align-middle"
                            >
                            <a
                                class="anchor text-primary-500-400-token xl:text-lg whitespace-nowrap"
                                href="/conditions/backcountry/{row.slug}"
                                data-sveltekit-preload-data="hover">{row.display_name}</a
                            >
                        </td
                        >
                        <td class="hidden  !align-middle font-bold sm:table-cell-fit sm:table-cell sm:text-center"
                        >
                        <div class="flex items-center justify-center">
                        <span class="p-2"><AvalancheDangerIcon dangerLevel={row.overall_danger_level} size='50px' /></span
                        >
                        {avalancheDangerRatingsMap[row.overall_danger_level]}
                    </div></td
                    >
                        <td class="hidden  !align-middle font-bold lg:table-cell-fit lg:table-cell lg:text-center"
                            >{row.current_temp}&degF
                            <span class="p-2"><WeatherIcon size="small" weatherDesc={row.current_weather} /></span
                            ></td
                        >
                        <td class="hidden  !align-middle font-bold lg:table-cell-fit lg:table-cell lg:text-center"
                            >{formatSnowfall(row.snow_past_7d)}"</td
                        >
                        <td class="text-center  !align-middle font-bold">{formatSnowfall(row.snow_past_24h)}"</td>
                        <td class="text-center  !align-middle font-bold">{formatSnowfall(row.snow_next_24h)}"</td>
                        <td class="hidden  !align-middle font-bold md:table-cell-fit md:table-cell md:text-center"
                            >{formatSnowfall(row.snow_next_72h)}"</td
                        >
                        <td class="!px-0 text-center !align-middle font-bold"
                            ><button type="button" class="btn btn-icon-sm w-[20px] space-x-0 px-0 py-0"
                                >
                                {#if isFavorite(row)}
                                <i class="fa-solid fa-bell text-yellow-500"></i>
                                {:else}
                                <i class="fa-regular fa-bell"></i>
                                {/if}
                                </button
                            ></td
                        >
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</div>
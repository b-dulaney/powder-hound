<script lang="ts">
	import WeatherIcon from "$lib/components/weather-icon.svelte";
	import type { ResortOverview } from "$lib/supabase.types";
	import { formatSnowfall } from "$lib/utils";
    import { resortSearchInput, resortColumnSort } from "./stores";

    export let resortOverviews: ResortOverview[];
    export let favorites: number[];

    const isFavorite = (mountain: ResortOverview) => favorites.includes(mountain.mountain_id);

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
					case 'weather':
						return (a.current_temp - b.current_temp) * sortOrder;
					case 'last24hours':
						return (a.snow_past_24h - b.snow_past_24h) * sortOrder;
					case 'next24hours':
						return (a.snow_next_24h - b.snow_next_24h) * sortOrder;
					case 'last48hours':
						return (a.snow_past_48h - b.snow_past_48h) * sortOrder;
					default:
						return a.display_name > b.display_name ? sortOrder : -sortOrder;
				}
			}) || [];

	};

    resortColumnSort.subscribe((value) => {
        sortLocations(value.name, value.asc);
    });

    $: if(resortOverviews.length > 0) {
        sortLocations($resortColumnSort.name, $resortColumnSort.asc);
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
                    <button class="group" on:click={() => updateColumnSort('location')}>
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
                    aria-sort={$resortColumnSort.name === 'weather'
                        ? $resortColumnSort.asc
                            ? 'ascending'
                            : 'descending'
                        : 'none'}
                >
                    <button class="group" on:click={() => updateColumnSort('weather')}>
                        Weather
                        <span class="pl-1" aria-hidden={$resortColumnSort.name !== 'weather'}>
                            {#if $resortColumnSort.name === 'weather' && $resortColumnSort.asc}
                                <i class="fa-solid fa-sort-up"></i>
                            {:else if $resortColumnSort.name === 'weather' && !$resortColumnSort.asc}
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
                                class="anchor text-primary-500-400-token xl:text-lg"
                                href="/conditions/resorts/{row.slug}"
                                data-sveltekit-preload-data="hover">{row.display_name}</a
                            ></td
                        >
                        <td class="hidden font-bold lg:table-cell-fit lg:table-cell lg:text-center"
                            >{row.current_temp}&degF
                            <span class="p-2"><WeatherIcon size="small" weatherDesc={row.current_weather} /></span
                            ></td
                        >
                        <td class="hidden font-bold md:table-cell-fit md:table-cell md:text-center"
                        >{formatSnowfall(row.snow_past_48h)}"</td
                    >
                        <td class="text-center font-bold">{formatSnowfall(row.snow_past_24h)}"</td>
                        <td class="text-center font-bold">{formatSnowfall(row.snow_next_24h)}"</td>
                        <td class="!px-0 text-center font-bold"
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
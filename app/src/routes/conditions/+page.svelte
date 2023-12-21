<script lang="ts">
	import WeatherIcon from '$lib/components/weather-icon.svelte';
  import type { MountainOverview } from '$lib/supabase.types';
  import type { PageData } from './$types';
  import { formatSnowfall } from '$lib/utils';
  export let data: PageData 
  const { mountainOverviews } = data
  
  let columnSort = { name: "location", asc: true }
  let searchInput = "";

  let filteredMountains: MountainOverview[] = [];

  const searchLocations = () => {
    filteredMountains = mountainOverviews?.filter((location) => {
      return location?.display_name?.toLowerCase().includes(searchInput.toLowerCase().trim());
    }) || [];
    sortLocations(columnSort.name, columnSort.asc);
  }

  const updateColumnSort = (sortBy: string) => {
    if (columnSort.name === sortBy) {
      columnSort.asc = !columnSort.asc;
    } else if (sortBy === "location") {
      columnSort.name = sortBy;
      columnSort.asc = true;
    }
    else {
      columnSort.name = sortBy;
      columnSort.asc = false;
    }
    sortLocations(columnSort.name, columnSort.asc);
  }

  const sortLocations = (sortBy: string, asc: boolean) => {
    const sortOrder = asc ? 1 : -1;
    const arrayToSort = filteredMountains.length > 0 ? filteredMountains : mountainOverviews;

     filteredMountains = arrayToSort?.sort((a, b) => {
      switch (sortBy) {
        case "location":
          return a.display_name > b.display_name ? sortOrder : -sortOrder;
        case "type":
          return (a.location_type > b.location_type ? sortOrder : -sortOrder);
        case "weather":
          return (a.currenttemp - b.currenttemp) * sortOrder;
        case "last7days":
          return (a.past7daysnowfall - b.past7daysnowfall) * sortOrder;
        case "last24hours":
          return (a.past24hoursnowfall - b.past24hoursnowfall) * sortOrder;
        case "next24hours":
          return (a.next24hoursnowfall - b.next24hoursnowfall) * sortOrder;
        case "next72hours":
          return (a.next72hoursnowfall - b.next72hoursnowfall) * sortOrder;
        default:
         return a.display_name > b.display_name ? sortOrder : -sortOrder;
      }
    }) || [];
    }

</script>

<section class="pt-8 md:p-4 lg:p-8 xl:p-16">
  <div class="flex justify-center mb-4">
    <h1 class="h1">Locations</h1>
  </div>
  <div class="flex justify-center items-center mb-4 px-8 md:py-8 w-full">
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] w-3/4 sm:w-2/3 lg:w-1/2 xl:w-1/3">
      <div class="input-group-shim"><i class="fa-solid fa-magnifying-glass"></i></div>
      <input type="search" autocomplete="off" placeholder="Search..." bind:value={searchInput} on:input={searchLocations}/>
    </div>
  </div>
    <div class="table-container">
      <table class="table">
        <caption class="sr-only">Snow and weather conditions for CO resorts and backcountry areas, column headers with buttons are sortable.</caption>
        <thead class="w-full">
          <tr>
            <th class="table-cell-fit" aria-sort={columnSort.name === "location" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("location")}>
                Location
                <span class="pl-1" aria-hidden={columnSort.name !== "location"}>
                  {#if columnSort.name === "location" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "location" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="hidden xl:table-cell xl:text-center xl:table-cell-fit"  aria-sort={columnSort.name === "type" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("type")}>
                Type
                <span class="pl-1" aria-hidden={columnSort.name !== "type"}>
                  {#if columnSort.name === "type" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "type" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                    <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="hidden lg:table-cell lg:text-center lg:table-cell-fit" aria-sort={columnSort.name === "weather" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("weather")}>
                Weather
                <span class="pl-1" aria-hidden={columnSort.name !== "weather"}>
                  {#if columnSort.name === "weather" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "weather" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="hidden md:table-cell md:text-center md:table-cell-fit" aria-sort={columnSort.name === "last7days" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("last7days")}>
                Last 7 Days
                <span class="pl-1" aria-hidden={columnSort.name !== "last7days"}>
                  {#if columnSort.name === "last7days" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "last7days" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="text-center table-cell-fit !px-1" aria-sort={columnSort.name === "last24hours" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("last24hours")}>
                Last 24H
                <span class="pl-1" aria-hidden={columnSort.name !== "last24hours"}>
                  {#if columnSort.name === "last24hours" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "last24hours" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="text-center table-cell-fit !pl-2 !pr-0" aria-sort={columnSort.name === "next24hours" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("next24hours")}>
                Next 24H
                <span class="pl-1" aria-hidden={columnSort.name !== "next24hours"}>
                  {#if columnSort.name === "next24hours" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "next24hours" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="hidden md:table-cell md:text-center md:table-cell-fit" aria-sort={columnSort.name === "next72hours" ? columnSort.asc ? "ascending" : "descending" : "none"}>
              <button class="group" on:click={() => updateColumnSort("next72hours")}>
                Next 72H
                <span class="pl-1" aria-hidden={columnSort.name !== "next72hours"}>
                  {#if columnSort.name === "next72hours" && columnSort.asc}
                    <i class="fa-solid fa-sort-up"></i>
                  {:else if columnSort.name === "next72hours" && !columnSort.asc}
                    <i class="fa-solid fa-sort-down"></i>
                  {:else}
                  <i class="fa-solid fa-sort opacity-25"></i>
                  {/if}
                </span>
              </button>
            </th>
            <th class="sm:table-cell-fit !px-0" aria-hidden></th>
          </tr>
        </thead>
        <tbody>
        {#if searchInput && filteredMountains.length === 0}
          <tr>
            <td colspan="8">
            <div class="flex justify-center m-4">
              <h3 class="h3">No results found</h3>
            </div>
            </td>
          </tr>

        {#if !mountainOverviews?.length}
        <tr>
          <td colspan="8">
          <div class="flex justify-center m-4">
            <h3 class="h3">No results found</h3>
          </div>
          </td>
        </tr>
        {/if}

        {:else}
          {#if filteredMountains.length > 0}
            {#each filteredMountains as row, i}
            <tr>
                <td class="table-cell-fit"><a class="anchor text-primary-500-400-token xl:text-lg" href="/conditions/{row.slug}">{row.display_name}</a></td>
                <td class="hidden capitalize xl:table-cell xl:text-center xl:table-cell-fit">
                  {#if row.location_type === "resort"}
                  <div class="badge variant-ghost-primary">
                    {row.location_type}
                  </div>
                  {:else}
                  <div class="badge variant-ghost-success">
                    {row.location_type}
                  </div>
                  {/if}
                </td>
                <td class="hidden font-bold lg:table-cell lg:text-center lg:table-cell-fit">{row.currenttemp}&degF <span class="p-2"><WeatherIcon size="small" weatherDesc={row.weather_desc}/></span></td>
                <td class="hidden font-bold md:table-cell md:text-center md:table-cell-fit">{formatSnowfall(row.past7daysnowfall)}"</td>
                <td class="text-center font-bold">{formatSnowfall(row.past24hoursnowfall)}"</td>
                <td class="text-center font-bold">{formatSnowfall(row.next24hoursnowfall)}"</td>
                <td class="hidden font-bold md:table-cell md:text-center md:table-cell-fit">{formatSnowfall(row.next72hoursnowfall)}"</td>
                <td class="text-center font-bold !px-0"><button type="button" class="btn btn-icon-sm space-x-0 px-0 py-0 w-[20px]"><i class="fa-regular fa-star"></i></button></td>
              </tr>
            {/each}
          {:else if mountainOverviews}
            {#each mountainOverviews as row, i}
            <tr>
                <td  class="table-cell-fit"><a class="anchor text-primary-500-400-token xl:text-lg" href="/conditions/{row.slug}">{row.display_name}</a></td>
                <td class="hidden capitalize xl:table-cell xl:text-center xl:table-cell-fit">
                  {#if row.location_type === "resort"}
                  <div class="badge variant-ghost-primary">
                    {row.location_type}
                  </div>
                  {:else}
                  <div class="badge variant-ghost-success">
                    {row.location_type}
                  </div>
                  {/if}
                </td>
                <td class="hidden font-bold lg:table-cell lg:text-center lg:table-cell-fit">{row.currenttemp}&degF <span class="p-2"><WeatherIcon size="small" weatherDesc={row.weather_desc}/></span></td>
                <td class="hidden font-bold md:table-cell md:text-center md:table-cell-fit">{formatSnowfall(row.past7daysnowfall)}"</td>
                <td class="text-center font-bold">{formatSnowfall(row.past24hoursnowfall)}"</td>
                <td class="text-center font-bold">{formatSnowfall(row.next24hoursnowfall)}"</td>
                <td class="hidden font-bold md:table-cell md:text-center md:table-cell-fit">{formatSnowfall(row.next72hoursnowfall)}"</td>
                <td class="text-center font-bold !px-0"><button type="button" class="btn btn-icon-sm space-x-0 px-0 py-0 w-[20px]"><i class="fa-regular fa-star"></i></button></td>
              </tr>
            {/each}
          {/if}
        {/if}
          </tbody>
        </table>
  </div> 
</section>

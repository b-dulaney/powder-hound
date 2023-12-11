<script lang="ts">
	import type { MountainOverview } from '$lib/supabase.types';
  import type { PageData } from './$types';
  export let data: PageData 
  const { mountainOverviews } = data

  let searchInput = "";

  let filteredMountains: MountainOverview[] = [];

  const searchLocations = () => {
    return filteredMountains = mountainOverviews?.filter((location) => {
      return location?.display_name?.toLowerCase().includes(searchInput.toLowerCase());
    })!;
  }

</script>

<section class="pt-8 md:p-4 lg:p-8 xl:p-16">
  <div class="flex justify-center mb-4">
    <h1 class="h1">Locations</h1>
  </div>
  <div class="flex justify-center mb-4 px-8 md:py-8">
    <input class="input w-2/3 md:w-1/2" title="Input (search)" type="search" placeholder="Search..." bind:value={searchInput} on:input={searchLocations}/>
  </div>

  {#if searchInput && filteredMountains.length === 0}
    <div class="flex justify-center mb-4">
      <h3 class="h3">No results found</h3>
    </div>
  {:else if filteredMountains.length > 0}
    <div class="table-container">
      <table class="table">
        <thead class="w-full">
          <tr>
            <th class="table-cell-fit">Location</th>
            <th class="hidden xl:table-cell xl:text-center xl:table-cell-fit">Type</th>
            <th class="hidden lg:table-cell lg:text-center lg:table-cell-fit">Weather</th>
            <th class="hidden md:table-cell md:text-center md:table-cell-fit">Last 5 Days</th>
            <th class="text-center table-cell-fit">Last 24H</th>
            <th class="text-center table-cell-fit">Next 24H</th>
            <th class="hidden md:table-cell md:text-center md:table-cell-fit">Next 72H</th>
            <th class="table-cell-fit"></th>
          </tr>
        </thead>
        <tbody>
          {#each filteredMountains as row, i}
          <tr>
              <td  class="table-cell-fit"><a class="anchor text-primary-500-400-token xl:text-lg" href="/conditions">{row.display_name}</a></td>
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
              <td class="hidden font-semibold lg:table-cell lg:text-center lg:table-cell-fit">{row.currenttemp}&degF</td>
              <td class="hidden font-semibold md:table-cell md:text-center md:table-cell-fit">{row.past5daysnowfall}"</td>
              <td class="text-center font-semibold">{row.past24hoursnowfall}"</td>
              <td class="text-center font-semibold">{row.next24hoursnowfall}"</td>
              <td class="hidden font-semibold md:table-cell md:text-center md:table-cell-fit">{row.next72hoursnowfall}"</td>
              <td class="text-center font-semibold"><button type="button" class="btn btn-icon-sm space-x-0 px-0 py-0 w-[20px]"><i class="fa-regular fa-star"></i></button></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if mountainOverviews}
  <div class="table-container">
    <table class="table">
      <thead class="w-full">
        <tr>
          <th class="table-cell-fit">Location</th>
          <th class="hidden xl:table-cell xl:text-center xl:table-cell-fit">Type</th>
          <th class="hidden lg:table-cell lg:text-center lg:table-cell-fit">Weather</th>
          <th class="hidden md:table-cell md:text-center md:table-cell-fit">Last 5 Days</th>
          <th class="text-center table-cell-fit">Last 24H</th>
          <th class="text-center table-cell-fit">Next 24H</th>
          <th class="hidden md:table-cell md:text-center md:table-cell-fit">Next 72H</th>
          <th class="table-cell-fit"></th>
        </tr>
      </thead>
      <tbody>
        {#each mountainOverviews as row, i}
        <tr>
            <td  class="table-cell-fit"><a class="anchor text-primary-500-400-token xl:text-lg" href="/conditions">{row.display_name}</a></td>
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
            <td class="hidden font-semibold lg:table-cell lg:text-center lg:table-cell-fit">{row.currenttemp}&degF</td>
            <td class="hidden font-semibold md:table-cell md:text-center md:table-cell-fit">{row.past5daysnowfall}"</td>
            <td class="text-center font-semibold">{row.past24hoursnowfall}"</td>
            <td class="text-center font-semibold">{row.next24hoursnowfall}"</td>
            <td class="hidden font-semibold md:table-cell md:text-center md:table-cell-fit">{row.next72hoursnowfall}"</td>
            <td class="text-center font-semibold"><button type="button" class="btn btn-icon-sm space-x-0 px-0 py-0 w-[20px]"><i class="fa-regular fa-star"></i></button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div> 
  {/if}
</section>

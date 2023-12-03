<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData 
  const { mountainOverviews } = data

</script>

<section class="pt-8">
  <div class="flex justify-center mb-4">
    <h1 class="h1">Mountains</h1>
  </div>
  <div class="flex justify-center mb-4 px-8">
    <input class="input" title="Input (search)" type="search" placeholder="Search..."/>
  </div>
  {#if mountainOverviews}
  <div class="table-container">
    <table class="table">
      <thead class="w-full">
        <tr>
          <th class="table-cell-fit">Location</th>
          <th class="text-center table-cell-fit">Last 24H</th>
          <th class="text-center table-cell-fit">Next 24H</th>
          <th class="table-cell-fit"></th>
        </tr>
      </thead>
      <tbody>
        {#each mountainOverviews as row, i}
          <tr>
            <td  class="table-cell-fit" ><a class="anchor" href="/conditions">{row.display_name}</a></td>
            <td class="text-center">{row.past24hoursnowfall}"</td>
            <td class="text-center">{row.next24hoursnowfall}"</td>
            <td class="text-center"><button type="button" class="btn btn-icon-sm space-x-0 px-0 py-0 w-[20px]"><i class="fa-regular fa-star"></i></button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {/if}
</section>

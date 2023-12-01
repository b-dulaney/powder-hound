<script lang="ts">
  // import type { PageData } from './$types';
  // export let data: PageData 
  import UnderConstruction from "../../components/under-construction.svelte";
</script>

<UnderConstruction />
<!-- <section class="w-full h-full p-6">

  <div class="grid grid-cols-5 gap-4 text-center p-8">
      <h2 class="text-xl font-semibold">Resort Name</h2>
      <h2 class="text-xl font-semibold">Last 5 Days</h2>
      <h2 class="text-xl font-semibold">Last 24 Hours</h2>
      <h2 class="text-xl font-semibold">Next 24 Hours</h2>
      <h2 class="text-xl font-semibold">Next 72 Hours</h2>
    </div>
  
  {#if data?.mountainOverviews?.length}
  <div class="grid grid-cols-1 gap-4 px-8">
      {#each data.mountainOverviews as {display_name, past5daysnowfall, past24hoursnowfall, next24hoursnowfall, next72hoursnowfall}}
      <div class=" p-4 rounded-lg cursor-pointer transform transition-all hover:scale-105">
          <div class="grid grid-cols-5 items-center">
            <h3 class="text-2xl font-semibold text-left">{display_name}</h3>
            <p class="text-gray-300 text-lg text-center">{past5daysnowfall}"</p>
            <p class="text-gray-300 text-lg text-center">{past24hoursnowfall}"</p>
            <p class="text-gray-300 text-lg text-center">{next24hoursnowfall}"</p>
            <p class="text-gray-300 text-lg text-center">{next72hoursnowfall}"</p>
          </div>
        </div>
      {/each}
  </div>
  {/if}
  <div class="mt-6">
      <button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >View More Resorts</button
      >
  </div>
</section> -->

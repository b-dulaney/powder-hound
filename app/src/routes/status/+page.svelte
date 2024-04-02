<script lang="ts">
    import ServiceHealthCard from './service-health-card.svelte';

	import { popup } from '@skeletonlabs/skeleton';
	import dayjs from 'dayjs';
	import type { PageData } from "./$types";

    export let data: PageData
    const { scrapingOverview } = data;
    const {recent_scraping_status: scrapingStatus} = scrapingOverview;

</script>   


    <section id="status-section" class="mx-auto w-full px-4 pb-8 pt-4 lg:max-w-4xl lg:pt-8">
        <h1 class="h2 text-center">Web Scraper Status</h1>
        <div class="flex justify-center">
            <ServiceHealthCard data={scrapingOverview}/>
        </div>

        <div class="grid grid-cols-1 gap-4 items-center">
            {#each scrapingStatus as s}
            <p class="font-semibold ">{s.display_name}</p>
                <div class="grid grid-cols-20 overflow-x-auto">
                        {#each s.status as status}
                            <div use:popup={{event: 'hover', target: status.id.toString(), placement: 'top'}} class={`[&>*]:pointer-events-none w-3 h-3 sm:w-4 sm:h-4 md:w-8 md:h-8 rounded-sm ${status.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div class="card px-4 py-2 variant-filled-surface" data-popup={status.id}>
                                <div class="flex flex-col gap-2">
                                    <p>{dayjs(status.time).format('h:mm a')}</p>
                                    {#if !status.success}
                                        <p class="text-sm">{status.error}</p>
                                    {/if}
                                </div>
                                <div class="arrow variant-filled-surface" />
                            </div>
                        {/each}
                </div>
            {/each}
        </div>
    </section>

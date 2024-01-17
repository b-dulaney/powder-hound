<script lang="ts">
    export let value: number;
    export let type: 'Base Depth' | 'Last 24 Hours' | 'Last 48 Hours' | 'Last 7 Days' | 'Next 24 Hours' | 'Season Total';
</script>

<div class="flex flex-col items-center justify-center h-full p-4 gap-2">
    <p class="text-2xl md:text-3xl xl:text-3xl font-bold">{value}<span class="tracking-tighter">"</span></p>
    <h4 class="xl:text-lg">{type}</h4>
</div>

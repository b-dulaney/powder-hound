<script lang="ts">
	export let value: number;
	export let type:
		| 'Base Depth'
		| 'Last 24 Hours'
		| 'Last 48 Hours'
		| 'Last 7 Days'
		| 'Next 24 Hours'
		| 'Season Total';
</script>

<div class="flex h-full flex-col items-center justify-center gap-2 p-4">
	<p class="text-2xl font-bold md:text-3xl xl:text-3xl">
		{value}<span class="tracking-tighter">"</span>
	</p>
	<p class="xl:text-lg">{type}</p>
</div>

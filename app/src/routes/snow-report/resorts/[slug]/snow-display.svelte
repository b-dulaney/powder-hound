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

<div class="flex flex-col h-full justify-center p-2">
		<p class="text-start text-surface-200">{type}</p>
		<p class="text-2xl text-start font-bold">
			{value}<span class="tracking-tighter">"</span>
		</p>
</div>

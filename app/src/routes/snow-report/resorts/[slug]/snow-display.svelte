<script lang="ts">
	export let value: number;
	export let closed: boolean = false;
	export let type:
		| 'Base Depth'
		| 'Last 24 Hours'
		| 'Last 48 Hours'
		| 'Last 7 Days'
		| 'Next 24 Hours'
		| 'Season Total';
</script>

<div class="flex h-full flex-col justify-center p-2">
	<p class="text-start text-surface-200">{type}</p>
	<p class="text-start text-2xl font-bold">
		{closed ? '--' : `${value}"`}
	</p>
</div>

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';
	import { Select } from 'flowbite-svelte';
	export let handler: DataHandler;
	export let showClosed: boolean;

	const setFilter = () => {
		if (showClosed === true) {
			handler.clearFilters();
			handler.invalidate();
		} else {
			handler.filter('false', 'closed');
			handler.invalidate();
		}
	};
</script>

<aside class="flex place-items-center pb-2 pt-6 text-gray-900 dark:text-gray-300">
	Show
	<Select class="ml-2" bind:value={showClosed} on:change={setFilter} placeholder="">
		<option value={false}>Open</option>
		<option value={true}>All</option>
	</Select>
</aside>

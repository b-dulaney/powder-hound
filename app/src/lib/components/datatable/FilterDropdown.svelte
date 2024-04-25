<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';
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

<aside class="flex place-items-center">
	Show
	<select class="select ml-2" bind:value={showClosed} on:change={setFilter}>
		<option value={false}>Open</option>
		<option value={true}>All</option>
	</select>
</aside>

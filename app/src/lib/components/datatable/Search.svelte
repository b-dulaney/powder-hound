<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';
	import { Input } from 'flowbite-svelte';
	import SearchOutline from 'flowbite-svelte-icons/SearchOutline.svelte';
	export let handler: DataHandler;
	let value: string;
	let timeout: NodeJS.Timeout;

	const search = () => {
		handler.search(value);
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			handler.invalidate();
		}, 400);
	};
</script>

<div class="w-[55%] max-w-sm pb-2 pt-6">
	<Input
		type="search"
		class="dark:bg-surface-800 dark:text-surface-50"
		autocomplete="off"
		placeholder="Search..."
		bind:value
		on:input={search}
	>
		<SearchOutline slot="left" class="h-5 w-5 text-surface-500 dark:text-surface-400" />
	</Input>
</div>

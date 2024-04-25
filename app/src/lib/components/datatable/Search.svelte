<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';
	export let handler: DataHandler;
	let value: string;
	let timeout: any;

	const search = () => {
		handler.search(value);
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			handler.invalidate();
		}, 400);
	};
</script>

<div class="input-group input-group-divider w-[55%] max-w-sm grid-cols-[auto_1fr_auto]">
	<div class="input-group-shim"><i class="fa-solid fa-magnifying-glass"></i></div>
	<input type="search" autocomplete="off" placeholder="Search..." bind:value on:input={search} />
</div>

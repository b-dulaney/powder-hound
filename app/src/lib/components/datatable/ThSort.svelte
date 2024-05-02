<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';
	import { Span } from 'flowbite-svelte';
	import CaretUpSolid from 'flowbite-svelte-icons/CaretUpSolid.svelte';
	import CaretDownSolid from 'flowbite-svelte-icons/CaretDownSolid.svelte';

	export let handler: DataHandler;
	export let orderBy: string;
	export let classes: string = '';
	export let center: boolean = false;

	const sorted = handler.getSort();

	// The sorting seems to work backwards here for some reason...
	const update = () => {
		if ($sorted.orderBy !== orderBy) {
			handler.sortAsc(orderBy);
		}
		if ($sorted.direction === 'desc' || $sorted.direction === undefined) {
			handler.sortAsc(orderBy);
		} else {
			handler.sortDesc(orderBy);
		}
		handler.invalidate();
	};

	$: sortAscClass =
		$sorted.orderBy === orderBy && $sorted.direction === 'asc'
			? `fill-surface-600 dark:fill-surface-100`
			: 'fill-surface-300 dark:fill-surface-400';
	$: sortDescClass =
		$sorted.orderBy === orderBy && $sorted.direction === 'desc'
			? `fill-surface-600 dark:fill-surface-100`
			: 'fill-surface-300 dark:fill-surface-400';
</script>

<th
	on:click={update}
	class:active={$sorted?.orderBy === orderBy}
	class={`cursor-pointer select-none px-6 py-3 ${classes}`}
>
	<div class="flex h-full w-full items-center justify-start" class:center>
		<slot />
		<Span class="ml-1 inline-flex flex-col">
			<CaretUpSolid class={`-mb-1 h-[10px] w-[10px] lg:h-[12px] lg:w-[12px] ${sortAscClass}`} />
			<CaretDownSolid class={`h-[10px] w-[10px] lg:h-[12px] lg:w-[12px] ${sortDescClass}`} />
		</Span>
	</div>
</th>

<style>
	div.center {
		justify-content: center;
	}
</style>

<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables/remote';

	export let handler: DataHandler;
	export let orderBy: string;
	export let classes: string;
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
</script>

<th
	on:click={update}
	class:active={$sorted?.orderBy === orderBy}
	class={`cursor-pointer select-none ${classes}`}
>
	<div class="flex h-full w-full items-center justify-start" class:center>
		<slot />
		<span class:asc={$sorted?.direction === 'asc'} class:desc={$sorted?.direction === 'desc'} />
	</div>
</th>

<style>
	div.center {
		justify-content: center;
	}
	th span {
		padding-left: 8px;
	}
	th span:before,
	th span:after {
		border: 4px solid transparent;
		content: '';
		display: block;
		height: 0;
		width: 0;
	}
	th span:before {
		border-bottom-color: #7a7a7a;
		margin-top: 2px;
	}
	th span:after {
		border-top-color: #7a7a7a;
		margin-top: 2px;
	}
	th.active span.asc:before {
		border-bottom-color: #e0e0e0;
	}

	th.active span.desc:after {
		border-top-color: #e0e0e0;
	}
</style>

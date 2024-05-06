<script lang="ts">
	import PineTreeSolid from '$lib/components/icons/PineTreeSolid.svelte';
	import SkiLiftSolid from '$lib/components/icons/SkiLiftSolid.svelte';

	export let currentPath: string;

	const baseClass =
		'w-full flex items-center rounded-t-xl justify-center px-4 py-2 group rounded-b-none';
	const activeClass =
		'text-surface-900 border-surface-900 dark:text-surface-50 dark:border-surface-50 border-b-2';
	const nonActiveClass =
		'border-transparent text-surface-500 dark:text-surface-400 dark:hover:bg-surface-800 hover:bg-surface-100 hover:text-surface-700 hover:border-surface-500 hover:border-b-2 dark:hover:text-surface-400 dark:hover:border-surface-400 border-surface-400 dark:border-surface-700';
</script>

<div class="w-full">
	<ul
		class="-mb-px flex flex-wrap justify-start text-center text-sm font-medium text-surface-500 dark:text-surface-400"
	>
		<li class="w-1/2 md:w-1/4 lg:w-1/5">
			<a
				href="/snow-report/resorts"
				class={`border-r-0 ${baseClass} ${
					currentPath === '/snow-report/resorts' ? activeClass : nonActiveClass
				}`}
				aria-current="page"
			>
				<SkiLiftSolid class="me-2 text-inherit" />
				Ski Resorts
			</a>
		</li>
		<li class="w-1/2 md:w-1/4 lg:w-1/5">
			<a
				href="/snow-report/backcountry"
				class={`border-s-0 ${baseClass} ${
					currentPath === '/snow-report/backcountry' ? activeClass : nonActiveClass
				}`}
			>
				<PineTreeSolid class="me-2 text-inherit" />
				Backcountry
			</a>
		</li>
	</ul>
</div>

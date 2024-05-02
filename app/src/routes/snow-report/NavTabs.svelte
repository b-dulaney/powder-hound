<script lang="ts">
	import PineTreeSolid from '$lib/components/icons/PineTreeSolid.svelte';
	import SkiLiftSolid from '$lib/components/icons/SkiLiftSolid.svelte';

	export let currentPath: string;

	const baseClass = 'w-full inline-flex items-center justify-center px-4 pb-2 group rounded-b-none';
	const activeClass =
		'text-primary-600 border-primary-600 dark:text-primary-500 dark:border-primary-500 border-b-4';
	const nonActiveClass =
		'border-transparent hover:text-surface-600 hover:border-surface-300 hover:border-b-4 dark:hover:text-surface-300 dark:hover:border-surface-300 border-surface-400 dark:border-surface-700';
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

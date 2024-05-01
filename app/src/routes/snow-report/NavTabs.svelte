<script lang="ts">
	export let currentPath: string;

	const baseClass =
		'inline-block p-4 w-full font-medium border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-700 transition';
	const activeClass =
		'bg-gray-50 font-semibold text-gray-700 dark:text-white dark:bg-gray-700 ring-2 ring-gray-300';
	const nonActiveClass =
		'bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white';
</script>

<ul
	class="flex w-full rounded-lg text-center text-sm font-medium text-gray-500 shadow dark:divide-gray-700 dark:text-gray-400 lg:text-base"
>
	<li class="w-1/2 focus-within:z-10">
		<a
			href="/snow-report/resorts"
			class={`rounded-s-lg border-r-0 ${baseClass} ${
				currentPath === '/snow-report/resorts' ? activeClass : nonActiveClass
			}`}
			aria-current="page">Ski Resorts</a
		>
	</li>
	<li class="w-1/2 focus-within:z-10">
		<a
			href="/snow-report/backcountry"
			class={`rounded-e-lg border-s-0 ${baseClass} ${
				currentPath === '/snow-report/backcountry' ? activeClass : nonActiveClass
			}`}>Backcountry</a
		>
	</li>
</ul>

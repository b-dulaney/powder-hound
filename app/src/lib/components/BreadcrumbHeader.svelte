<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let title: string;
</script>

<Breadcrumb
	aria-label="Navigation breadcrumbs"
	solid
	class="rounded-none border-0 border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900"
	olClass="inline-flex items-center space-x-1 mx-auto w-full max-w-screen-2xl"
>
	<BreadcrumbItem
		linkClass="ms-1 text-sm font-medium text-surface-700 hover:text-surface-900 md:ms-2 dark:text-surface-400 dark:hover:text-white"
		homeClass="inline-flex items-center text-sm font-medium text-surface-700 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
		spanClass="ms-1 text-sm font-medium text-surface-500 md:ms-2 dark:text-surface-400"
		href="/"
		home>Home</BreadcrumbItem
	>
	<BreadcrumbItem
		linkClass="ms-1 text-sm font-medium text-surface-700 hover:text-surface-900 md:ms-2 dark:text-surface-400 dark:hover:text-white"
		homeClass="inline-flex items-center text-sm font-medium text-surface-700 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
		spanClass="ms-1 text-sm font-medium text-surface-500 md:ms-2 dark:text-surface-400"
		>{title}</BreadcrumbItem
	>
</Breadcrumb>

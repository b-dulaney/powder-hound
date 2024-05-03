<script lang="ts">
	import { page } from '$app/stores';
	import NavTabs from '$lib/components/snow-report/NavTabs.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	$: path = $page.url.pathname;
	$: pages = path.split('/');

	$: console.log(pages);
	function buildHref(index: number) {
		return pages.slice(0, index + 1).join('/');
	}

	$: isSnowReportPage =
		pages[pages.length - 1] === 'backcountry' || pages[pages.length - 1] === 'resorts';
</script>

<!-- Navigation breadcrumbs shown on everything but the home page -->
{#if path !== '/'}
	<div
		in:fly={{ easing: cubicOut, y: -10, duration: 300, delay: 400 }}
		out:fly={{ easing: cubicIn, y: -10, duration: 300 }}
	>
		<Breadcrumb
			aria-label="Navigation breadcrumbs"
			solid
			class="rounded-none border-0 border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900"
			olClass="inline-flex items-center space-x-1 mx-auto w-full max-w-screen-2xl"
		>
			{#each pages as page, i (page)}
				{#if !page}
					<BreadcrumbItem
						linkClass="ms-1 text-sm font-medium text-surface-700 hover:text-surface-900 md:ms-2 dark:text-surface-400 dark:hover:text-white"
						homeClass="inline-flex items-center text-sm font-medium text-surface-700 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
						spanClass="ms-1 text-sm font-medium text-surface-500 md:ms-2 dark:text-surface-400"
						href="/"
						home>Home</BreadcrumbItem
					>
				{:else if page !== 'snow-report'}
					<BreadcrumbItem
						linkClass="ms-1 capitalize text-sm font-medium text-surface-700 hover:text-surface-900 md:ms-2 dark:text-surface-400 dark:hover:text-white"
						homeClass="inline-flex items-center text-sm font-medium text-surface-700 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
						spanClass="ms-1 text-sm font-medium text-surface-500 md:ms-2 dark:text-surface-400"
						href={buildHref(i)}>{page.replace('-', ' ')}</BreadcrumbItem
					>
				{/if}
			{/each}
		</Breadcrumb>
	</div>
{/if}

<!-- Nav tabs for snow report page only -->
{#if isSnowReportPage}
	<div
		class="flex w-full flex-col border-b border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900"
		in:fly={{ easing: cubicOut, y: -20, duration: 300, delay: 400 }}
		out:fade={{ easing: cubicIn, duration: 300 }}
	>
		<div class="mx-auto inline-flex w-full max-w-screen-2xl justify-start">
			<NavTabs currentPath={$page.url.pathname} />
		</div>
	</div>
{/if}

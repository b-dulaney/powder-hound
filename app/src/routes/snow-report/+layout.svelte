<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	import { page } from '$app/stores';
	import BreadcrumbHeader from '$lib/components/BreadcrumbHeader.svelte';
	import NavTabs from './NavTabs.svelte';
</script>

<BreadcrumbHeader title="Snow Report" />

<div
	class="flex w-full flex-col border-b border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900"
>
	<div class="mx-auto inline-flex w-full max-w-screen-2xl justify-start">
		<NavTabs currentPath={$page.url.pathname} />
	</div>
</div>

<slot />

<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';

	import { Tabs, TabItem } from 'flowbite-svelte';

	import { page } from '$app/stores';
	import BreadcrumbHeader from '$lib/components/BreadcrumbHeader.svelte';
	import NavTabs from './NavTabs.svelte';
</script>

<BreadcrumbHeader title="Snow Report" />

<div class="mx-auto flex w-full max-w-xs flex-col pt-4 sm:max-w-xl">
	<NavTabs currentPath={$page.url.pathname} />
</div>

<slot />

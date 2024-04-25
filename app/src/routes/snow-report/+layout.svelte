<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import BreadcrumbHeader from '$lib/components/BreadcrumbHeader.svelte';
</script>

<BreadcrumbHeader title="Snow Report" />

<div class="mx-auto flex w-full max-w-lg justify-center pb-8 pt-2">
	<TabGroup justify="justify-center" class="w-full">
		<TabAnchor
			role="tab"
			selected={$page.url.pathname === '/snow-report/resorts'}
			name="Ski Resorts"
			class="w-1/2 md:text-xl"
			href="/snow-report/resorts"
			data-sveltekit-preload-data-hover
		>
			Ski Resorts
		</TabAnchor>
		<TabAnchor
			role="tab"
			selected={$page.url.pathname === '/snow-report/backcountry'}
			name="Backcountry"
			class="w-1/2 md:text-xl"
			href="/snow-report/backcountry"
			data-sveltekit-preload-data-hover
		>
			Backcountry
		</TabAnchor>
	</TabGroup>
</div>

<slot />

<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>

<section class="mx-auto w-full pt-4 md:px-4 lg:max-w-7xl lg:pt-8">
	<ol class="breadcrumb px-4 pb-5 md:px-0 lg:text-lg">
		<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li class="text-surface-300">Snow Report</li>
	</ol>
	<div class="flex justify-center lg:mb-4">
		<h1 class="h1">Snow Report</h1>
	</div>

	<div class="flex w-full justify-center pt-4">
		<TabGroup justify="justify-center">
			<TabAnchor
				role="tab"
				selected={$page.url.pathname === '/snow-report/resorts'}
				name="Ski Resorts"
				class="md:text-xl"
				href="/snow-report/resorts"
				data-sveltekit-preload-data-hover
			>
				Ski Resorts
			</TabAnchor>
			<TabAnchor
				role="tab"
				selected={$page.url.pathname === '/snow-report/backcountry'}
				name="Backcountry"
				class="md:text-xl"
				href="/snow-report/backcountry"
				data-sveltekit-preload-data-hover
			>
				Backcountry
			</TabAnchor>
		</TabGroup>
	</div>
</section>

<slot />

<script lang="ts">
	import { TabGroup, TabAnchor } from "@skeletonlabs/skeleton";
    import { page } from '$app/stores';    
</script>

<section class="mx-auto w-full lg:max-w-[90rem] md:px-4 pt-4 lg:pt-8">
	<ol class="breadcrumb lg:text-lg px-4 md:px-0 pb-5">
		<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li class="text-surface-300">Conditions</li>
	</ol>
	<div class="lg:mb-4 flex justify-center">
		<h1 class="h1">Conditions</h1>
	</div>

	<div class="pt-4 flex w-full justify-center">
		<TabGroup justify="justify-center">
			<TabAnchor role="tab" selected={$page.url.pathname === '/conditions/resorts'} name="Ski Resorts" class="md:text-xl" href="/conditions/resorts" data-sveltekit-preload-data-hover>
				Ski Resorts
			</TabAnchor>
			<TabAnchor role="tab" selected={$page.url.pathname === '/conditions/backcountry'} name="Backcountry" class="md:text-xl" href="/conditions/backcountry" data-sveltekit-preload-data-hover>
				Backcountry
			</TabAnchor>
		</TabGroup>
	</div>
</section>

<slot />
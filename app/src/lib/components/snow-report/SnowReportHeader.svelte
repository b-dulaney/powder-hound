<script lang="ts">
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	export let details: ResortDetail | BackcountryDetail;
	export let snowReportHref: string;
	export let isResort: boolean;
	export let closed: boolean;
</script>

<ol class="breadcrumb lg:text-lg">
	<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb !ml-0 md:!ml-4">
		<a class="anchor !text-surface-300" href={snowReportHref}>Snow Report</a>
	</li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb text-surface-300">{details.display_name}</li>
</ol>

<div class="mt-4 flex flex-col sm:gap-2">
	<h1 class="h2">{details.display_name} Snow Report</h1>
	<span class="flex items-center">
		<p class="mr-2 text-base">Region -</p>
		<p class="text-base">{details.region}</p>
	</span>
	{#if isResort}
		<span class="flex items-center">
			<p class="mr-2 text-base">Status:</p>
			{#if closed}
				<p class="text-base font-semibold text-primary-400">Closed</p>
			{:else}
				<p class="text-base font-semibold text-emerald-400">Open</p>
			{/if}
		</span>
	{/if}
</div>

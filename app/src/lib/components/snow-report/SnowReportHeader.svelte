<script lang="ts">
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	export let details: ResortDetail | BackcountryDetail;
	export let snowReportHref: string;
	export let isResort: boolean;
	export let closed: boolean;
</script>

<ol class="breadcrumb">
	<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb !ml-0 md:!ml-4">
		<a class="anchor !text-surface-300" href={snowReportHref}>Snow Report</a>
	</li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li class="crumb text-surface-300">{details.display_name}</li>
</ol>

<div class="flex flex-col pt-1 md:gap-1">
	<h1 class="h2">{details.display_name} Snow Report</h1>
	<span class="flex items-center">
		<p class="mr-2 text-sm sm:text-base">Region -</p>
		<p class="text-sm sm:text-base">{details.region}</p>
	</span>
	{#if isResort}
		<span class="flex items-center">
			<p class="mr-2 text-sm sm:text-base">Status:</p>
			{#if closed}
				<p class="text-sm font-semibold text-primary-400 sm:text-base">Closed</p>
			{:else}
				<p class="text-sm font-semibold text-emerald-400 sm:text-base">Open</p>
			{/if}
		</span>
	{/if}
</div>

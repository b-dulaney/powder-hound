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

<div class="mt-4 flex flex-col">
	<h1 class="h1">{details.display_name} Snow Report</h1>
	<span class="flex items-center">
		<p class="mr-2 mt-2 text-xl">Region -</p>
		<p class="mt-2 text-xl">{details.region}</p>
	</span>
	{#if isResort}
		<span class="flex items-center">
			<p class="mr-2 mt-2 text-xl">Status:</p>
			{#if closed}
				<p class="mt-2 text-xl font-semibold text-primary-400">Closed</p>
			{:else}
				<p class="mt-2 text-xl font-semibold text-emerald-400">Open</p>
			{/if}
		</span>
	{/if}
</div>

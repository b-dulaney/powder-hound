<script lang="ts">
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	export let details: ResortDetail|BackcountryDetail
	export let snowReportHref: string
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
		<p class="mr-2 mt-2 text-xl text-surface-300">Region:</p>
		<p class="mt-2 text-xl text-surface-300">{details.region}</p>
	</span>
</div>

<script lang="ts">
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { Breadcrumb, BreadcrumbItem, Heading, Span, P } from 'flowbite-svelte';
	export let details: ResortDetail | BackcountryDetail;
	export let snowReportHref: string;
	export let isResort: boolean;
	export let closed: boolean;
</script>

<Breadcrumb
	aria-label="Navigation breadcrumbs"
	solid
	class="rounded-none border-x-0 border-t-0 border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900"
	olClass="inline-flex items-center space-x-1 mx-auto w-full max-w-screen-2xl"
>
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem href={snowReportHref}>Snow Report</BreadcrumbItem>
	<BreadcrumbItem>{details.display_name}</BreadcrumbItem>
</Breadcrumb>

<div class="mx-auto flex w-full max-w-screen-2xl flex-col p-2 md:gap-1 lg:py-6">
	<Heading
		tag="h1"
		class="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-4xl"
		>{details.display_name} Snow Report</Heading
	>
	<Span class="flex items-center">
		<P class="mr-2 text-sm sm:text-base">Region -</P>
		<P class="text-sm sm:text-base">{details.region}</P>
	</Span>
	{#if isResort}
		<Span class="flex items-center">
			<P class="mr-2 text-sm sm:text-base">Status:</P>
			{#if closed}
				<P class="text-sm font-semibold text-red-400 sm:text-base">Closed</P>
			{:else}
				<P class="text-sm font-semibold text-green-400 sm:text-base">Open</P>
			{/if}
		</Span>
	{/if}
</div>

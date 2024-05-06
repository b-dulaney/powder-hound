<script lang="ts">
	import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
	import { Heading, P, Span } from 'flowbite-svelte';
	export let details: ResortDetail | BackcountryDetail;
	export let isResort: boolean;
	export let closed: boolean;
</script>

<div class="mx-auto flex w-full max-w-screen-xl flex-col p-2 md:gap-1 lg:py-6">
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

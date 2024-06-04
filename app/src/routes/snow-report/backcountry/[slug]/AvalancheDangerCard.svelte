<script lang="ts">
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import Card from '$lib/components/card.svelte';
	import type { BackcountryDetail } from '$lib/supabase.types';
	import dayjs from 'dayjs';
	import { AccordionItem, Accordion, P, Span, A } from 'flowbite-svelte';
	export let backcountryDetails: BackcountryDetail;
</script>

<Card showFooter>
	<svelte:fragment slot="header">Avalanche Danger</svelte:fragment>
	<svelte:fragment slot="footer">Issued on: {backcountryDetails.issue_date}</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
			{#each backcountryDetails.danger_levels as { date, above_treeline, near_treeline, below_treeline }, i}
				<div id="avy-forecast-container" class="w-full">
					<P class="py-2">{date ?? dayjs().add(i, 'days').format('dddd, MMM D')}</P>
					<div class="flex w-full flex-col">
						<div
							class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-300 bg-surface-100 p-2 dark:border-b-surface-700 dark:bg-surface-900"
						>
							<P class="min-w-[105px] whitespace-nowrap text-sm  md:text-base">Above Treeline</P>
							<P class="flex-grow text-center text-sm font-semibold md:text-base">
								{above_treeline.level} - {above_treeline.rating}
							</P>
							<span class="flex items-center justify-end"
								><AvalancheDangerIcon dangerLevel={above_treeline.level} size="40px" /></span
							>
						</div>
						<div
							class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-300 p-2 dark:border-b-surface-700"
						>
							<P class="min-w-[105px] whitespace-nowrap text-sm  md:text-base">Near Treeline</P>
							<P class="flex-grow text-center text-sm font-semibold md:text-base">
								{near_treeline.level} - {near_treeline.rating}
							</P>
							<span class="flex items-center justify-end"
								><AvalancheDangerIcon dangerLevel={near_treeline.level} size="40px" /></span
							>
						</div>
						<div
							class="flex w-full items-center justify-between gap-0 rounded-sm border-b border-b-surface-300 bg-surface-100 p-2 dark:border-b-surface-700 dark:bg-surface-900"
						>
							<P class="min-w-[105px] whitespace-nowrap text-sm md:text-base">Below Treeline</P>
							<P class="flex-grow text-center text-sm font-semibold md:text-base">
								{below_treeline.level} - {below_treeline.rating}
							</P>
							<span class="flex-shrink"
								><AvalancheDangerIcon dangerLevel={below_treeline.level} size="40px" /></span
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<Accordion class="px-6 py-2" flush>
			<AccordionItem borderBottomClass="border-0">
				<Span slot="header">Report Summary</Span>
				<p class="text-gray-900 dark:text-white">{@html backcountryDetails.avalanche_summary}</p>
			</AccordionItem>
		</Accordion>
	</svelte:fragment>
</Card>

<A></A>

<style>
	p :global(a) {
		--tw-text-opacity: 1;
		color: #8745ab;
		text-decoration-line: underline;
	}
	p :global(a:hover) {
		--tw-brightness: brightness(1.1);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
</style>

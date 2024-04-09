<script lang="ts">
	import AvalancheDangerIcon from '$lib/components/avalanche-danger-icon.svelte';
	import Card from '$lib/components/card.svelte';
	import type { BackcountryDetail, StackedChartData } from '$lib/supabase.types';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	export let backcountryDetails: BackcountryDetail;
</script>

<Card showFooter>
	<svelte:fragment slot="header">Avalanche Danger</svelte:fragment>
	<svelte:fragment slot="footer">Issued on: {backcountryDetails.issue_date}</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
			{#each backcountryDetails.danger_levels as { date, above_treeline, near_treeline, below_treeline }}
				<div id="avy-forecast-container" class="w-full">
					<h3 class="h4 py-2">{date}</h3>
					<div class="flex w-full flex-col">
						<div
							class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-500 bg-surface-800 p-2"
						>
							<p class="min-w-[105px] whitespace-nowrap text-sm text-surface-300 md:text-base">
								Above Treeline
							</p>
							<p class="flex-grow text-center text-sm font-semibold md:text-base">
								{above_treeline.level} - {above_treeline.rating}
							</p>
							<span class="flex items-center justify-end"
								><AvalancheDangerIcon dangerLevel={above_treeline.level} size="40px" /></span
							>
						</div>
						<div
							class="flex w-full items-center justify-between rounded-sm border-b border-b-surface-500 p-2"
						>
							<p class="min-w-[105px] whitespace-nowrap text-sm text-surface-300 md:text-base">
								Near Treeline
							</p>
							<p class="flex-grow text-center text-sm font-semibold md:text-base">
								{near_treeline.level} - {near_treeline.rating}
							</p>
							<span class="flex items-center justify-end"
								><AvalancheDangerIcon dangerLevel={near_treeline.level} size="40px" /></span
							>
						</div>
						<div
							class="flex w-full items-center justify-between gap-0 rounded-sm border-b border-b-surface-500 bg-surface-800 p-2"
						>
							<p class="min-w-[105px] whitespace-nowrap text-sm text-surface-300 md:text-base">
								Below Treeline
							</p>
							<p class="flex-grow text-center text-sm font-semibold md:text-base">
								{below_treeline.level} - {below_treeline.rating}
							</p>
							<span class="flex-shrink"
								><AvalancheDangerIcon dangerLevel={below_treeline.level} size="40px" /></span
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<Accordion class="px-2 py-4" regionPanel="space-y-0">
			<AccordionItem>
				<svelte:fragment slot="summary">Report Summary</svelte:fragment>
				<svelte:fragment slot="content"
					><p>{@html backcountryDetails.avalanche_summary}</p></svelte:fragment
				>
			</AccordionItem>
		</Accordion>
	</svelte:fragment>
</Card>

<style>
	p :global(a) {
		--tw-text-opacity: 1;
		color: rgb(var(--color-primary-500) / var(--tw-text-opacity));
		text-decoration-line: underline;
	}
	p :global(a:hover) {
		--tw-brightness: brightness(1.1);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
</style>

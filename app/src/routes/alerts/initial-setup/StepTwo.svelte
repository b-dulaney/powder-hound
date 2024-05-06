<script lang="ts">
	import { Badge, Button, Card, Label, P, Select, Span } from 'flowbite-svelte';
	import ArrowLeftOutline from 'flowbite-svelte-icons/ArrowLeftOutline.svelte';
	import ArrowRightOutline from 'flowbite-svelte-icons/ArrowRightOutline.svelte';
	import BellActiveSolid from 'flowbite-svelte-icons/BellActiveSolid.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { AlertThreshold } from './types';

	// Props
	export let alertThresholds: AlertThreshold[];

	// Handlers and functions
	const prevStepDispatch = createEventDispatcher();
	const nextStepDispatch = createEventDispatcher();

	function handlePrevStep() {
		prevStepDispatch('prevStep');
	}

	function handleNextStep() {
		nextStepDispatch('nextStep');
	}
</script>

<Card size="none" class="mx-auto w-full max-w-screen-md dark:bg-surface-900">
	<div class="flex min-h-[500px] w-full flex-col items-center justify-between">
		<div class="flex flex-col items-center">
			<h2 class="flex items-center text-lg font-semibold text-surface-800 dark:text-white">
				<BellActiveSolid class="me-1 h-6 w-6 " />
				Create Alert(s)
			</h2>
			<P class="mt-1 max-w-xl text-center text-sm">
				Pick your definition of a powder day. You can always change the thresholds later.
			</P>
		</div>

		<div class="my-6 flex w-full flex-col gap-2 sm:mb-10 md:max-h-[40vh] md:overflow-auto">
			{#if !alertThresholds.length}
				<P class="py-6 text-center sm:py-10">🌵 No locations selected</P>
			{/if}
			{#each alertThresholds as { mountain_id, name, location_type, threshold } (mountain_id)}
				<div
					class="mx-auto w-full max-w-2xl border-b border-surface-200 p-4 dark:border-surface-700"
				>
					<div class="flex w-full items-center justify-between gap-2 py-4 first:pt-0 last:pb-0">
						<Span class="inline-flex flex-col gap-2 dark:text-surface-200 md:text-lg">
							{name}
							{#if location_type === 'resort'}
								<Badge class="w-20" color="blue">Resort</Badge>
							{:else}
								<Badge class="w-24" color="green">Backcountry</Badge>
							{/if}
						</Span>

						<Label class="inline-flex items-center gap-4">
							<Span class="hidden sm:block">Snowfall</Span>
							<Select
								size="sm"
								placeholder="Select a threshold"
								class="w-24"
								bind:value={threshold}
							>
								<option value={1}>1+ in</option>
								<option value={3}>3+ in</option>
								<option value={6}>6+ in</option>
								<option value={12}>12+ in</option>
							</Select>
						</Label>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex w-full items-center justify-between p-4">
			<Button on:click={handlePrevStep} color="light"
				><ArrowLeftOutline class="me-2 h-5 w-5" />Back</Button
			>
			<Button on:click={handleNextStep} color="light"
				>Next<ArrowRightOutline class="ms-2 h-5 w-5" /></Button
			>
		</div>
	</div>
</Card>

<script lang="ts">
	import { Alert, Badge, Button, Card, Li, List, P, Span } from 'flowbite-svelte';
	import ArrowLeftOutline from 'flowbite-svelte-icons/ArrowLeftOutline.svelte';
	import ArrowRightOutline from 'flowbite-svelte-icons/ArrowRightOutline.svelte';
	import CheckCircleSolid from 'flowbite-svelte-icons/CheckCircleSolid.svelte';
	import InfoCircleSolid from 'flowbite-svelte-icons/InfoCircleSolid.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { AlertThreshold } from './types';

	// Props
	export let alertThresholds: AlertThreshold[];

	// Handlers and functions
	const dispatch = createEventDispatcher();

	function handleComplete() {
		dispatch('complete');
	}

	function handlePrevStep() {
		dispatch('prevStep');
	}
</script>

<Card size="none" class="mx-auto w-full max-w-screen-md dark:bg-surface-900">
	<div class="flex min-h-[500px] w-full flex-col items-center justify-between">
		<div class="flex flex-col items-center">
			<h2 class="flex items-center text-lg font-semibold text-surface-800 dark:text-white">
				<CheckCircleSolid class="me-1 h-6 w-6 " />
				Review Alert(s)
			</h2>
			<P class="mt-1 max-w-xl text-center text-sm">Almost finished - let's review.</P>
		</div>

		{#if alertThresholds.length}
			<Alert color="blue" class="my-6 !items-start dark:bg-blue-500/10">
				<span slot="icon">
					<InfoCircleSolid slot="icon" class="h-5 w-5 md:h-6 md:w-6" />
					<span class="sr-only">Info</span>
				</span>
				<p class="font-semibold">
					You'll receive up to 2 emails per day based on your alert settings.
				</p>
				<List class="mt-2 sm:ms-4" position="outside">
					<Li class=""
						><span class="font-semibold underline">Forecast Emails</span> - these are sent in the afternoon
						if the 24 hour forecast meets your threshold.
					</Li>
					<Li class=""
						><span class="font-semibold underline">Overnight Emails</span> - sent early in the AM to
						confirm overnight or 24 hour snowfall. We'll give you plenty of time to call in sick.</Li
					>
				</List>
			</Alert>
		{/if}

		<div class="mb-6 flex w-full flex-col gap-2 sm:mb-10 md:max-h-[40vh] md:overflow-auto">
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

						<Span class="text-sm">{threshold}+ inches</Span>
					</div>
				</div>
			{/each}
		</div>

		<div class="flex w-full items-center justify-between p-4">
			<Button on:click={handlePrevStep} color="light"
				><ArrowLeftOutline class="me-2 h-5 w-5" />Back</Button
			>
			<Button on:click={handleComplete} color="primary"
				>Finish<ArrowRightOutline class="ms-2 h-5 w-5" /></Button
			>
		</div>
	</div>
</Card>

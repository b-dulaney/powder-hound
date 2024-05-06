<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Badge,
		Button,
		ButtonGroup,
		Card,
		Checkbox,
		CloseButton,
		Input,
		P,
		Span,
		Star
	} from 'flowbite-svelte';
	import MapPinAltSolid from 'flowbite-svelte-icons/MapPinAltSolid.svelte';
	import { createEventDispatcher } from 'svelte';

	import ArrowRightOutline from 'flowbite-svelte-icons/ArrowRightOutline.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { MountainPreview } from './types';

	// Props
	export let selectedMountainIDs: number[];
	export let mountainData: MountainPreview[];

	// Component variables
	const accordions = Array(3);
	let searchValue = '';
	let showingResorts = true;
	let showingBackcountry = false;

	// Component state
	$: filteredMountains = mountainData?.filter(
		(d) =>
			d.display_name.toLowerCase().includes(searchValue) &&
			((showingResorts && d.location_type === 'resort') ||
				(showingBackcountry && d.location_type === 'backcountry'))
	);

	$: if (selectedMountainIDs.length) {
		openAll();
	}

	// Handlers and functions
	const openAll = () => accordions.forEach((_, i) => (accordions[i] = true));

	const dispatch = createEventDispatcher<{ nextStep: number[] }>();

	function handleNextStep() {
		dispatch('nextStep', selectedMountainIDs);
	}

	function handleClearSearch() {
		searchValue = '';
	}

	function handleShowResorts() {
		showingResorts = !showingResorts;
	}

	function handleShowBackcountry() {
		showingBackcountry = !showingBackcountry;
	}
</script>

<Card size="none" class="mx-auto w-full max-w-screen-md dark:bg-surface-900">
	<div class="flex min-h-[500px] w-full flex-col items-center justify-between">
		<div class="flex flex-col items-center">
			<h2 class="flex items-center text-lg font-semibold text-surface-800 dark:text-white">
				<MapPinAltSolid class="me-1 h-6 w-6 " />
				Select Location(s)
			</h2>
			<P class="mt-1 max-w-xl text-center text-sm">
				Pick the locations that we'll send you snowfall alerts for. You can add more at any time.
			</P>
		</div>

		<ButtonGroup class="mx-auto mt-8 w-72 max-w-lg sm:w-full">
			<Input
				class="dark:bg-surface-800"
				bind:value={searchValue}
				on:input={openAll}
				type="search"
				placeholder="Search..."
			>
				<CloseButton slot="right" on:click={handleClearSearch} />
			</Input>
		</ButtonGroup>
		<div class="mt-4 flex justify-center gap-4">
			<Button size="xs" on:click={handleShowResorts} color="blue" outline={!showingResorts} pill
				>{showingResorts ? 'Hide Resorts' : 'Show Resorts'}</Button
			>
			<Button
				size="xs"
				on:click={handleShowBackcountry}
				color="green"
				outline={!showingBackcountry}
				pill>{showingBackcountry ? 'Hide Backcountry' : 'Show Backcountry'}</Button
			>
		</div>
		<div class="flex w-full justify-start gap-3 pt-8">
			<Span class="text-sm font-normal">{selectedMountainIDs?.length} selected</Span>
			<button
				on:click={() => (selectedMountainIDs = [])}
				class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
			>
				Clear all
			</button>
		</div>

		<Accordion flush multiple defaultClass="w-full my-2">
			<AccordionItem
				activeClass="bg-surface-50 dark:bg-surface-800"
				bind:open={accordions[0]}
				class="hover:text-surface-800 dark:hover:brightness-125"
			>
				<span slot="header">Rockies</span>
				{#if filteredMountains?.length}
					<ul class="grid w-full rounded-lg bg-transparent md:grid-cols-2">
						{#each filteredMountains as mountain (mountain)}
							<li
								in:fade={{ duration: 300, easing: cubicInOut }}
								out:fade={{ duration: 300, easing: cubicInOut }}
							>
								<Checkbox
									custom
									bind:group={selectedMountainIDs}
									value={mountain.mountain_id}
									class="inline-flex w-full cursor-pointer items-center gap-2 rounded-lg py-3 text-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 sm:gap-3 sm:px-2 md:text-xl"
								>
									<Star
										size={30}
										strokeColor="#3b82f6"
										fillColor="#3b82f6"
										id={mountain.mountain_id.toString()}
										fillPercent={selectedMountainIDs?.includes(mountain.mountain_id) ? 100 : 0}
									/>
									{mountain.display_name}
									{#if mountain.location_type === 'resort'}
										<Badge color="blue">Resort</Badge>
									{:else}
										<Badge color="green">Backcountry</Badge>
									{/if}
								</Checkbox>
							</li>
						{/each}
					</ul>
				{:else}
					<P class="text-center">No results</P>
				{/if}
			</AccordionItem>
			<AccordionItem
				activeClass="bg-surface-50 dark:bg-surface-800"
				class="hover:text-surface-800 dark:hover:brightness-125"
			>
				<span slot="header">Sierras - Coming Soon</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">Stay tuned...</p>
			</AccordionItem>
			<AccordionItem
				activeClass="bg-surface-50 dark:bg-surface-800"
				class="hover:text-surface-800 dark:hover:brightness-125"
			>
				<span slot="header">PNW - Coming Soon</span>
				<p class="mb-2 text-gray-500 dark:text-gray-400">Stay tuned...</p>
			</AccordionItem>
		</Accordion>

		<div class="flex w-full items-center justify-end p-4">
			<Button on:click={handleNextStep} color="light"
				>Next<ArrowRightOutline class="ms-2 h-5 w-5" /></Button
			>
		</div>
	</div>
</Card>

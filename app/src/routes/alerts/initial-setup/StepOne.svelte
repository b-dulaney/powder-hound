<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Badge,
		Button,
		ButtonGroup,
		Checkbox,
		CloseButton,
		Input,
		P,
		Span,
		Star
	} from 'flowbite-svelte';
	import ChevronRightOutline from 'flowbite-svelte-icons/ChevronRightOutline.svelte';
	import { createEventDispatcher } from 'svelte';

	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let mountainData: {
		mountain_id: number;
		display_name: string;
		location_type: string;
	}[];

	const dispatch = createEventDispatcher();

	const accordions = Array(3);

	const openAll = () => accordions.forEach((_, i) => (accordions[i] = true));

	let searchValue = '';
	let selectedMountains: number[] = [];
	let showingResorts = true;
	let showingBackcountry = false;

	$: filteredMountains = mountainData?.filter(
		(d) =>
			d.display_name.toLowerCase().includes(searchValue) &&
			((showingResorts && d.location_type === 'resort') ||
				(showingBackcountry && d.location_type === 'backcountry'))
	);

	function handleNextStep() {
		dispatch('nextStep');
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

<div class="flex flex-col items-center">
	<h2 class="text-lg font-semibold text-surface-800 dark:text-white sm:mt-4 sm:px-4">
		Select Location(s)
	</h2>
	<P class="mt-1 max-w-xl text-center text-sm sm:px-4">
		Pick the locations that we'll send you snowfall alerts for. You can add more at any time.
	</P>

	<ButtonGroup class="mx-auto mt-8 w-72 max-w-lg sm:w-full sm:px-4">
		<Input bind:value={searchValue} on:input={openAll} type="search" placeholder="Search...">
			<CloseButton slot="right" on:click={handleClearSearch} />
		</Input>
	</ButtonGroup>
	<div class="mt-4 sm:px-4">
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
	<div class="inline-flex w-full justify-start gap-3 px-4 pt-6 md:px-6">
		<Span class="text-sm font-normal">{selectedMountains.length} selected</Span>
		<button
			on:click={() => (selectedMountains = [])}
			class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
		>
			Clear all
		</button>
	</div>
</div>

<Accordion
	multiple
	defaultClass="bg-surface-50 dark:bg-surface-900 rounded-2xl dark:text-white rounded-b-none my-2"
>
	<AccordionItem
		activeClass="bg-surface-50 dark:bg-surface-800"
		bind:open={accordions[0]}
		class="bg-surface-50 dark:bg-surface-800"
	>
		<span slot="header">Rockies</span>
		{#if filteredMountains?.length}
			<ul class="grid w-full gap-x-4 rounded-lg bg-transparent md:grid-cols-2 lg:grid-cols-3">
				{#each filteredMountains as mountain (mountain)}
					<li
						in:fade={{ duration: 300, easing: cubicInOut }}
						out:fade={{ duration: 300, easing: cubicInOut }}
					>
						<Checkbox
							custom
							bind:group={selectedMountains}
							value={mountain.mountain_id}
							class="inline-flex w-full cursor-pointer gap-3 rounded-lg px-2 py-3 text-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-200 dark:hover:bg-surface-800 md:text-xl"
						>
							<Star
								size={30}
								strokeColor="#3b82f6"
								fillColor="#3b82f6"
								id={mountain.mountain_id.toString()}
								fillPercent={selectedMountains.includes(mountain.mountain_id) ? 100 : 0}
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
	<AccordionItem class="bg-surface-50 dark:bg-surface-800">
		<span slot="header">Sierras - Coming Soon</span>
		<p class="mb-2 text-gray-500 dark:text-gray-400">Stay tuned...</p>
	</AccordionItem>
	<AccordionItem class="bg-surface-50 dark:bg-surface-800">
		<span slot="header">PNW - Coming Soon</span>
		<p class="mb-2 text-gray-500 dark:text-gray-400">Stay tuned...</p>
	</AccordionItem>
</Accordion>

<div class="flex w-full items-center justify-end py-4 sm:px-4">
	<Button on:click={handleNextStep} size="lg" color="light"
		>Next <ChevronRightOutline class="ms-1 h-6 w-6" /></Button
	>
</div>

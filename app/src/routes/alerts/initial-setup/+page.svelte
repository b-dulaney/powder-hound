<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	import { StepIndicator } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import StepOne from './StepOne.svelte';
	import StepThree from './StepThree.svelte';
	import StepTwo from './StepTwo.svelte';
	import type { AlertThreshold } from './types';

	// Props
	export let data: PageData;

	// Page variables
	const { mountainData, supabase, session } = data;
	const steps = ['Step 1', 'Step 2', 'Step 3'];
	let prevNavigation = false;
	let currentStep = 1;
	let selectedMountainIDs: number[] = [];
	let alertThresholds: AlertThreshold[] = [];
	let top: HTMLHeadingElement;

	// Page state
	$: selectedMountains = mountainData?.filter((d) => selectedMountainIDs.includes(d.mountain_id));
	$: {
		if (selectedMountains) {
			selectedMountains.forEach((m) => {
				// If the mountain is not already in alertThresholds, add it
				if (!alertThresholds.find((threshold) => threshold.mountain_id === m.mountain_id)) {
					alertThresholds.push({
						mountain_id: m.mountain_id,
						location_type: m.location_type,
						name: m.display_name,
						threshold: 1
					});
				}
			});

			// Remove any mountains from alertThresholds that are no longer selected
			alertThresholds = alertThresholds.filter((threshold) =>
				selectedMountains.find((mountain) => mountain.mountain_id === threshold.mountain_id)
			);
		}
	}

	// Handlers and functions
	function handleStepOneNext(event: CustomEvent<number[]>) {
		prevNavigation = false;
		selectedMountainIDs = event.detail;
		currentStep += 1;
		scrollToTop();
	}

	function handleStepTwoNext() {
		prevNavigation = false;
		currentStep += 1;
		scrollToTop();
	}

	function handlePrevStep() {
		prevNavigation = true;
		currentStep -= 1;
		scrollToTop();
	}

	function scrollToTop() {
		top.scrollIntoView();
	}

	async function handleComplete() {
		const { error: alertError } = await supabase.from('user_alerts').insert(
			alertThresholds.map((a) => ({
				user_id: session?.user.id,
				email: session?.user.email,
				display_name: a.name,
				mountain_id: a.mountain_id,
				threshold_inches: a.threshold,
				paused: false
			}))
		);

		if (alertError) {
			console.error(alertError);
		}
		goto('/snow-report/resorts', { replaceState: true });
	}
</script>

<svelte:head>
	<title>PowderHound | Set up your alerts</title>
</svelte:head>

<div class="absolute top-0" bind:this={top} />
<PageHeading title="Set up Alerts" />

<StepIndicator {currentStep} class="mx-auto max-w-screen-md px-4" {steps} size="h-1.5" />

<SectionContainer id="alert-setup">
	{#if currentStep === 1 && mountainData}
		<div in:fly={{ duration: 500, x: prevNavigation ? -300 : 300 }}>
			<StepOne on:nextStep={handleStepOneNext} {mountainData} {selectedMountainIDs} />
		</div>
	{/if}
	{#if currentStep === 2 && alertThresholds}
		<div in:fly={{ duration: 500, x: prevNavigation ? -300 : 300 }}>
			<StepTwo {alertThresholds} on:nextStep={handleStepTwoNext} on:prevStep={handlePrevStep} />
		</div>
	{/if}
	{#if currentStep === 3 && alertThresholds}
		<div in:fly={{ duration: 500, x: prevNavigation ? -300 : 300 }}>
			<StepThree {alertThresholds} on:complete={handleComplete} on:prevStep={handlePrevStep} />
		</div>
	{/if}
</SectionContainer>

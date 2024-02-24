<script lang="ts">
	import {
		Stepper,
		Step,
		InputChip,
		Autocomplete,
		type AutocompleteOption
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	export let data: PageData;
	const { supabase, mountainData, userId, email } = data;
	let inputChip = '';
	let inputChipList: string[] = [];
	let top: HTMLHeadingElement;

	interface AlertThreshold {
		mountain_id: number;
		name: string;
		threshold: number;
	}

	const alertThresholds: AlertThreshold[] = [];

	const autoCompleteOptions: AutocompleteOption<string>[] = (mountainData || []).map((m) => ({
		label: m.display_name,
		value: m.display_name
	}));

	function scrollToTop() {
		top.scrollIntoView();
	}

	function onInputChipSelect(e: CustomEvent<AutocompleteOption<string>>) {
		inputChipList = [...inputChipList, e.detail.label];
		const mountain = mountainData?.find((m) => m.display_name === e.detail.label);
		alertThresholds.push({
			mountain_id: mountain?.mountain_id!,
			name: mountain?.display_name!,
			threshold: 1
		});
	}

	function onInputChipRemove(e: CustomEvent<{event: MouseEvent, chipIndex: number, chipValue: string}>) {
		inputChipList = inputChipList.filter((c) => c !== e.detail.chipValue);
		alertThresholds.splice(
			alertThresholds.findIndex((a) => a.name === e.detail.chipValue),
			1
		);
	}

	function onSnowfallSelect(e: Event, name: string) {
		const alert = alertThresholds.find((a) => a.name === name);
		if (alert) {
			alert.threshold = Number((e?.target as HTMLInputElement)?.value ?? 0);
		}
	}

	async function onComplete() {
		const { error: alertError } = await supabase.from('user_alerts').insert(
			alertThresholds.map((a) => ({
				user_id: userId,
				email,
				display_name: a.name,
				mountain_id: a.mountain_id,
				threshold_inches: a.threshold,
				paused: false
			}))
		);

		if (alertError) {
			console.error(alertError);
		}
		goto('/snow-report', { replaceState: true });
	}
</script>

<svelte:head>
	<title>PowderHound | Set up your alerts</title>
</svelte:head>

<div class="flex max-h-full w-full justify-center p-4 pb-8">
	<div class="flex flex-col gap-4">
		<h1 class="h1 text-center !text-3xl" bind:this={top}>Set up Alerts</h1>
		<div class="card max-h-full w-full overflow-y-auto p-4">
			<Stepper
				on:complete={onComplete}
				on:step={scrollToTop}
				on:next={scrollToTop}
				on:back={scrollToTop}
			>
				<Step>
					<svelte:fragment slot="header">Favorite Locations</svelte:fragment>
					<p class="max-w-xl">
						Select the locations that we'll send you snowfall alerts for. You can add more at any
						time.
					</p>
					<div class="mt-4 flex flex-col items-center gap-2">
						<InputChip
							class="max-w-sm md:max-w-xl"
							bind:input={inputChip}
							bind:value={inputChipList}
							on:remove={onInputChipRemove}
							name="chips"
							chips="variant-filled-secondary"
							placeholder="Search..."
							allowUpperCase
						/>

						<div
							class="card variant-ghost-surface max-h-56 w-full max-w-sm overflow-y-auto p-4 md:max-w-xl"
							tabindex="-1"
						>
							<Autocomplete
								bind:input={inputChip}
								options={autoCompleteOptions}
								denylist={inputChipList}
								on:selection={onInputChipSelect}
							/>
						</div>
					</div></Step
				>
				<Step>
					<svelte:fragment slot="header">Snowfall Alerts</svelte:fragment>
					<p class="max-w-xl">
						Select the amount of snowfall that you'd like to receive alerts for at each location.
					</p>
					<div class="flex flex-col gap-2 py-4">
						{#if inputChipList.length > 0}
							{#each inputChipList as chip (chip)}
								<div class="flex items-center justify-between gap-2">
									<p class="flex-auto font-semibold">{chip}</p>
									<select
										class="select w-1/2 text-center md:w-1/3"
										on:change={(e) => onSnowfallSelect(e, chip)}
										value={alertThresholds.find((v) => v.name === chip)?.threshold}
									>
										<option value={1}>1+ inch</option>
										<option value={3}>3+ inches</option>
										<option value={6}>6+ inches</option>
										<option value={12}>12+ inches</option>
									</select>
								</div>
							{/each}
						{:else}
							<p class="py-4 text-center text-surface-400">No favorites selected.</p>
						{/if}
					</div>
				</Step>
				<Step class="max-w">
					<svelte:fragment slot="header">Review Alerts</svelte:fragment>
					{#if !alertThresholds.length}
						<p class="max-w-xl py-4 text-center text-surface-400">
							No alerts configured. You can set them up at any time in the future.
						</p>
					{:else}
					<div class="mt-4 flex flex-col gap-4">
						<p class="max-w-xl">You'll receive two types of alerts for the locations and thresholds you selected.</p>
						<p class="max-w-xl">
							<strong class="font-semibold underline">Forecast Alerts</strong> - to help you plan ahead,
							we'll send these in the afternoon and report snowfall expected in the next 24 hours.
						</p>
						<p class="max-w-xl">
							<strong class="font-semibold underline">Overnight Alerts</strong> - these confirm overnight
							or past 24 hour snowfall and are sent early in the AM, so you'll have plenty of time to
							call in sick.
						</p>
					</div>
						<div class="flex w-full flex-col gap-2 py-4">
							{#each alertThresholds as alert (alert)}
								<div class="flex w-full items-center justify-between gap-2">
									<p class="flex-auto font-semibold">{alert.name}</p>
									<p>{alert.threshold}+ inches</p>
								</div>
							{/each}
						</div>
					{/if}
				</Step>
			</Stepper>
		</div>
	</div>
</div>

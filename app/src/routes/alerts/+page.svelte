<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	import Card from '$lib/components/card.svelte';
	import { type ToastSettings } from '$lib/components/toasts';
	import { addToast } from '$lib/components/toasts/toastStore';
	import type { UserAlerts } from '$lib/supabase.types';
	import { Alert, Button, Dropdown, DropdownItem, Modal, P, Select } from 'flowbite-svelte';
	import CirclePlusOutline from 'flowbite-svelte-icons/CirclePlusOutline.svelte';
	import DotsVerticalOutline from 'flowbite-svelte-icons/DotsVerticalOutline.svelte';
	import InfoCircleSolid from 'flowbite-svelte-icons/InfoCircleSolid.svelte';
	import PauseSolid from 'flowbite-svelte-icons/PauseSolid.svelte';
	import PlaySolid from 'flowbite-svelte-icons/PlaySolid.svelte';
	import TrashBinSolid from 'flowbite-svelte-icons/TrashBinSolid.svelte';
	import { flip } from 'svelte/animate';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';

	// Props
	export let data: PageData;

	// Page variables
	let alerts: UserAlerts[] = [];
	let showModal = false;

	const updateSuccessToast: ToastSettings = {
		type: 'success',
		message: 'Alert(s) updated successfully.',
		timeout: 3000
	};

	const failureToast: ToastSettings = {
		type: 'error',
		message: 'Action failed. Please try again.',
		timeout: 5000
	};

	const deleteSuccessToast: ToastSettings = {
		type: 'delete',
		message: 'Alert(s) deleted successfully.',
		timeout: 3000
	};

	// Page state
	$: alerts = data.alerts;

	// Handlers and functions
	async function onThresholdChange(e: Event, id: number) {
		const { value } = e.target as HTMLSelectElement;
		const alertToUpdate = alerts?.find((a) => a.id === id);
		if (!alertToUpdate || !alerts) return;

		alertToUpdate.threshold_inches = parseInt(value);
		const response = await fetch(`/api/alerts/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(alertToUpdate)
		});

		if (response.ok) {
			addToast(updateSuccessToast);
		} else {
			addToast(failureToast);
		}
	}

	async function handleDelete(id: number) {
		const alertToDelete = alerts?.find((a) => a.id === id);
		if (!alertToDelete || !alerts) return;
		const newAlerts = alerts.filter((a) => a.id !== id);

		const response = await fetch(`/api/alerts/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			alerts = newAlerts;
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
		}
	}

	async function handlePause(id: number) {
		const alertToPause = alerts?.find((a) => a.id === id);
		if (!alertToPause || !alerts) return;

		alertToPause.paused = !alertToPause.paused;
		const response = await fetch(`/api/alerts/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(alertToPause)
		});

		if (response.ok) {
			addToast(updateSuccessToast);
			alerts = [...alerts];
		} else {
			addToast(failureToast);
		}
	}

	async function handlePauseAll() {
		const pausedAlerts = alerts?.map((a) => ({ ...a, paused: true }));
		if (!pausedAlerts || !alerts) return;

		const response = await fetch(`/api/alerts`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pausedAlerts)
		});

		if (response.ok) {
			addToast(updateSuccessToast);
			alerts = [...pausedAlerts];
		} else {
			addToast(failureToast);
		}
	}

	async function handleResumeAll() {
		const resumedAlerts = alerts?.map((a) => ({ ...a, paused: false }));
		if (!resumedAlerts || !alerts) return;

		const response = await fetch(`/api/alerts`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(resumedAlerts)
		});

		if (response.ok) {
			addToast(updateSuccessToast);
			alerts = [...resumedAlerts];
		} else {
			addToast(failureToast);
		}
	}

	async function handleDeleteAll() {
		const ids = alerts?.map((a) => a.id);
		if (!ids || !alerts) return;

		const failedRequests = [];

		for (const id of ids) {
			const response = await fetch(`/api/alerts/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				failedRequests.push(id);
			}
		}

		if (failedRequests.length === 0) {
			alerts = [];
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
		}
	}
</script>

<svelte:head>
	<title>PowderHound | Manage your alerts</title>
	<meta property="og:site_name" content="PowderHound" />
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:title" content="PowderHound | Manage your alerts" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/alerts" />
	<meta property="og:image" content="https://powderhound.io/og?title=Manage Your Alerts" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content="Get real-time snow reports, accurate weather predictions, and customized snowfall alerts for Colorado - all 100% free. You'll never miss another powder day."
	/>
</svelte:head>

<PageHeading title="Alerts" />

<SectionContainer id="alerts">
	<div class="mx-auto flex w-full flex-col items-center justify-center gap-2">
		{#each alerts as { id, display_name, threshold_inches, paused } (id)}
			<div
				out:fly={{ duration: 300, x: 500, easing: cubicOut }}
				animate:flip={{ delay: 50, duration: 300 }}
				class="w-full max-w-3xl"
			>
				<Card showHeader={false}>
					<svelte:fragment slot="body">
						<div class="flex w-full flex-col p-4">
							<div
								class="grid w-full grid-cols-2 items-center gap-4 border-b border-b-surface-600 py-4 first:pt-0 last:border-b-0 last:pb-0"
							>
								{#if paused}
									<P
										class="inline-flex items-center text-surface-500 dark:text-surface-500 md:text-lg"
									>
										<PauseSolid class="mr-2 h-5 w-5" />
										{display_name}
									</P>
								{:else}
									<P class="dark:text-surface-200 md:text-lg">
										{display_name}
									</P>
								{/if}

								<div class="flex items-center justify-end gap-4">
									<Select
										size="sm"
										placeholder=""
										class="w-24"
										on:change={(e) => onThresholdChange(e, id)}
										value={threshold_inches}
									>
										<option value={1}>1+ in</option>
										<option value={3}>3+ in</option>
										<option value={6}>6+ in</option>
										<option value={12}>12+ in</option>
									</Select>

									<DotsVerticalOutline
										id={`alert-${id}`}
										class="dots-menu cursor-pointer dark:text-white md:hidden"
									/>
									{#key paused}
										<Dropdown triggeredBy={`#alert-${id}`}>
											{#if paused}
												<DropdownItem
													on:click={() => handlePause(id)}
													class="inline-flex items-center"
												>
													<PlaySolid class="mr-2 h-5 w-5" />
													Resume
												</DropdownItem>
											{:else}
												<DropdownItem
													on:click={() => handlePause(id)}
													class="inline-flex items-center"
												>
													<PauseSolid class="mr-2 h-5 w-5" />
													Pause
												</DropdownItem>
											{/if}
											<DropdownItem
												on:click={() => handleDelete(id)}
												class="inline-flex items-center"
											>
												<TrashBinSolid class="mr-2 h-5 w-5" />
												Delete
											</DropdownItem>
										</Dropdown>
									{/key}

									<div class="hidden justify-end gap-6 md:flex">
										{#if paused}
											<Button size="sm" color="light" on:click={() => handlePause(id)}>
												<PlaySolid class="mr-2 h-5 w-5" />
												Resume
											</Button>
										{:else}
											<Button size="sm" color="light" on:click={() => handlePause(id)}>
												<PauseSolid class="mr-1 h-5 w-5 " />
												Pause
											</Button>
										{/if}
										<Button size="sm" outline color="red" on:click={() => handleDelete(id)}>
											<TrashBinSolid class="mr-1 h-5 w-5 " />
											Delete
										</Button>
									</div>
								</div>
							</div>
						</div>
					</svelte:fragment>
				</Card>
			</div>
		{/each}
	</div>

	{#if alerts.length}
		<div class="mx-auto flex w-full max-w-3xl justify-end gap-2 px-2 py-6 sm:py-10">
			{#if !alerts?.every((a) => a.paused)}
				<Button on:click={handlePauseAll} color="light">
					<PauseSolid class="mr-1 h-5 w-5 text-surface-600 dark:text-white" />
					Pause All
				</Button>
			{/if}
			{#if alerts?.every((a) => a.paused)}
				<Button on:click={handleResumeAll} color="light">
					<PlaySolid class="mr-2 h-5 w-5" />
					Resume All
				</Button>
			{/if}
			<Button on:click={() => (showModal = true)} color="red">
				<TrashBinSolid class="mr-1 h-5 w-5 " />
				Delete All
			</Button>
		</div>
	{/if}

	{#if !alerts.length}
		<div class="mx-auto" in:fade={{ duration: 300, easing: cubicIn }}>
			<Alert color="blue" class="border border-blue-500 dark:border-0 dark:bg-slate-800">
				<div class="flex items-center gap-3">
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<strong class="md:text-lg">No alerts found.</strong>
				</div>
				<p class="mb-4 mt-2 max-w-xl md:text-base">
					You can create some here, or you can add them by selecting a location from one of the Snow
					Report pages.
				</p>
				<div class="flex gap-2">
					<Button
						color="blue"
						class="px-4 py-2 text-sm md:text-base"
						on:click={() => goto('/alerts/initial-setup')}
						><CirclePlusOutline class="me-2 h-5 w-5" />Add alerts</Button
					>
					<Button
						color="blue"
						class="px-4 py-2 text-sm md:text-base"
						outline
						href="/snow-report/resorts">Go to Snow Report</Button
					>
				</div>
			</Alert>
		</div>
	{/if}
</SectionContainer>

<Modal title="Delete all alerts" bind:open={showModal} size="sm" autoclose outsideclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-200">
		If you want a break from our emails, you can always pause your alerts and resume them at a later
		date. Are you sure you want to delete all of your alerts?
	</p>
	<div class="flex w-full justify-end pt-4">
		<Button color="alternative">No, cancel</Button>
		<Button color="red" class="ms-2" on:click={handleDeleteAll}>Yes, delete alerts</Button>
	</div>
</Modal>

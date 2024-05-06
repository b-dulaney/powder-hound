<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BackcountryDetail, ResortDetail, UserAlerts } from '$lib/supabase.types';
	import type { Session } from '@supabase/supabase-js';
	import BellActiveAltSolid from 'flowbite-svelte-icons/BellActiveAltSolid.svelte';
	import BellSolid from 'flowbite-svelte-icons/BellSolid.svelte';

	import { addToast, type ToastSettings } from '$lib/components/toasts';
	import { Button, Label, Modal, P, Select, Span } from 'flowbite-svelte';

	// Props
	export let existingAlert: boolean;
	export let session: Session | undefined;
	export let details: BackcountryDetail | ResortDetail;
	export let alertData: UserAlerts | undefined;

	// Component variables
	let showAddModal = false;
	let showModifyModal = false;
	let selectedThresholdInches = 1;
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
		message: 'Alert deleted successfully.',
		timeout: 3000
	};

	// Handlers and functions
	async function deleteAlert() {
		const alertId = alertData?.id;
		if (!alertId) return;

		const response = await fetch(`/api/alerts/${alertId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (response.ok) {
			existingAlert = false;
			invalidate('update:existingAlert');
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
		}
	}

	function handleModifyAlertModal() {
		if (session) {
			showModifyModal = true;
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	}

	function handleAddAlertModal() {
		if (session) {
			showAddModal = true;
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	}

	async function addAlert() {
		if (session) {
			const body = {
				mountain_id: details?.mountain_id,
				display_name: details?.display_name,
				threshold_inches: selectedThresholdInches,
				user_id: session?.user.id,
				email: session?.user.email,
				paused: false
			};
			const response = await fetch(`/api/alerts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (response.ok) {
				selectedThresholdInches = 1;
				existingAlert = true;
				addToast(updateSuccessToast);
				invalidate('update:existingAlert');
			} else {
				addToast(failureToast);
			}
		}
	}
</script>

{#if existingAlert === false}
	<Button
		color="light"
		pill={true}
		class="inline-flex gap-2 !p-2 md:!px-4 md:!py-2.5"
		on:click={handleAddAlertModal}
	>
		<BellSolid class="h-6 w-6" />
		<p class="hidden whitespace-nowrap md:inline-block">Add Alert</p>
	</Button>
{/if}
{#if existingAlert === true}
	<Button
		color="light"
		pill={true}
		on:click={handleModifyAlertModal}
		class="inline-flex gap-2 !p-2 md:!px-4 md:!py-2.5"
	>
		<BellActiveAltSolid class="h-6 w-6 text-blue-500" />
		<p class="hidden whitespace-nowrap md:inline-block">Modify Alert</p>
	</Button>
{/if}

<Modal
	bind:open={showAddModal}
	size="xs"
	title="Add alert"
	autoclose
	outsideclose
	classHeader="text-surface-700 dark:text-white"
>
	<P>Select the snowfall threshold that you'll receive alerts for.</P>
	<div class="flex items-center justify-between gap-2 py-6">
		<P>{details?.display_name}</P>
		<Label class="inline-flex items-center gap-4">
			<Span class="hidden font-medium sm:block">Snowfall</Span>
			<Select
				size="sm"
				placeholder="Select a threshold"
				class="w-24"
				bind:value={selectedThresholdInches}
			>
				<option value={1}>1+ in</option>
				<option value={3}>3+ in</option>
				<option value={6}>6+ in</option>
				<option value={12}>12+ in</option>
			</Select>
		</Label>
	</div>
	<div class="flex w-full justify-end">
		<Button color="alternative">Cancel</Button>
		<Button class="ms-2" on:click={addAlert}>Save</Button>
	</div>
</Modal>

{#if alertData}
	<Modal
		bind:open={showModifyModal}
		size="xs"
		title="Modify alert"
		autoclose
		outsideclose
		classHeader="text-surface-700 dark:text-white"
	>
		<div class="flex items-center justify-between gap-2 py-6">
			<P>{details?.display_name}</P>
			<Label class="inline-flex items-center gap-4">
				<Span class="hidden font-medium sm:block">Snowfall</Span>
				<Select
					size="sm"
					placeholder="Select a threshold"
					class="w-24"
					bind:value={alertData.threshold_inches}
				>
					<option value={1}>1+ in</option>
					<option value={3}>3+ in</option>
					<option value={6}>6+ in</option>
					<option value={12}>12+ in</option>
				</Select>
			</Label>
		</div>
		<div class="flex w-full justify-between">
			<Button color="red" outline on:click={deleteAlert}>Delete</Button>
			<span>
				<Button color="alternative">Cancel</Button>
				<Button class="ms-2" on:click={addAlert}>Save</Button>
			</span>
		</div>
	</Modal>
{/if}

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { UserAlerts } from '$lib/supabase.types';
	import type { Session } from '@supabase/supabase-js';
	import BellActiveAltSolid from 'flowbite-svelte-icons/BellActiveAltSolid.svelte';

	import { addToast, type ToastSettings } from '$lib/components/toasts';
	import { Button, Label, Modal, P, Select, Span } from 'flowbite-svelte';

	// Props
	export let session: Session | null;
	export let alertData: UserAlerts | undefined;
	export let size: 'sm' | 'lg';

	// Component variables
	let showEditModal = false;

	const pClass = size === 'sm' ? 'hidden text-xs sm:inline-block' : 'text-xs md:text-sm';
	const iconClass = size === 'sm' ? 'h-4 w-4 sm:me-2' : 'me-2 h-4 w-4 md:h-5 w-5';
	const buttonClass =
		size === 'sm'
			? 'rounded-2xl p-1.5 sm:rounded-lg sm:px-3 sm:py-2 md:px-4'
			: 'rounded-lg px-4 py-2';

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
			invalidate('update:existingAlert');
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
		}
	}

	function handleEditAlertModal() {
		if (session) {
			showEditModal = true;
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	}

	async function editAlert() {
		if (!alertData) return;
		const body = {
			...alertData
		};
		const response = await fetch(`/api/alerts/${alertData.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (response.ok) {
			addToast(updateSuccessToast);
			invalidate('update:existingAlert');
		} else {
			addToast(failureToast);
		}
	}
</script>

<Button color="light" class={`${buttonClass}`} on:click={handleEditAlertModal}>
	<BellActiveAltSolid class={`${iconClass} text-blue-700 dark:text-blue-500`} />
	<p class={`${pClass} whitespace-nowrap`}>Edit Alert</p>
</Button>

{#if alertData}
	<Modal
		bind:open={showEditModal}
		size="xs"
		title="Edit alert"
		autoclose
		outsideclose
		classHeader="text-surface-700 dark:text-white"
	>
		<div class="flex items-center justify-between gap-2 py-6">
			<P>{alertData.display_name}</P>
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
				<Button class="ms-2" on:click={editAlert}>Save</Button>
			</span>
		</div>
	</Modal>
{/if}

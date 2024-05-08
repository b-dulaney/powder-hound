<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import BellSolid from 'flowbite-svelte-icons/BellSolid.svelte';

	import { addToast, type ToastSettings } from '$lib/components/toasts';
	import { Button, Label, Modal, P, Select, Span } from 'flowbite-svelte';
	// Props
	export let session: Session | null;
	export let mountainID: number;
	export let displayName: string;
	export let size: 'sm' | 'lg';

	// Component variables
	let showAddModal = false;
	let selectedThresholdInches = 1;

	const pClass = size === 'sm' ? ' hidden text-xs sm:inline-block' : 'text-xs md:text-sm';
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

	// Handlers and functions
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
				mountain_id: mountainID,
				display_name: displayName,
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
				addToast(updateSuccessToast);
				invalidate('update:existingAlert');
			} else {
				addToast(failureToast);
			}
		}
	}
</script>

<Button color="light" class={`${buttonClass}`} on:click={handleAddAlertModal}>
	<BellSolid class={`${iconClass} text-surface-600 dark:text-surface-400`} />
	<p class={`${pClass} whitespace-nowrap`}>Add Alert</p>
</Button>

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
		<P>{displayName}</P>
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

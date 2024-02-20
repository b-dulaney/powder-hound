<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { selectedMountain } from '../../routes/snow-report/stores';

	const modalStore = getModalStore();
	let threshold_inches = 1;

	export let parent: SvelteComponent;

	async function handleSave() {
		const body = {
			mountain_id: $selectedMountain?.mountain_id,
			display_name: $selectedMountain?.display_name,
			threshold_inches,
			user_id: $modalStore[0].meta.user_id,
			email: $modalStore[0].meta.email,
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
			if ($modalStore[0].response) $modalStore[0].response({ success: true });
			parent.onClose();
		} else {
			if ($modalStore[0].response) $modalStore[0].response({ error: true });
			parent.onClose();
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal-slim space-y-4 p-4 shadow-xl">
		<header class="text-2xl font-bold">{$modalStore[0].title}</header>
		<p>Select the snowfall threshold that you'll receive alerts for.</p>
		<div class="flex flex-col gap-4 py-4">
			<div class="flex items-center justify-between gap-2">
				<p class="font-semibold">{$selectedMountain?.display_name}</p>
				<select class="select w-2/5 text-center" bind:value={threshold_inches}>
					<option value={1}>1+ inch</option>
					<option value={3}>3+ inches</option>
					<option value={6}>6+ inches</option>
					<option value={12}>12+ inches</option>
				</select>
			</div>
			<footer class="modal-footer mt-4 {parent.regionFooter}">
				<button class="variant-outline-tertiary btn" on:click={parent.onClose}>Cancel</button>
				<button class="variant-filled-primary btn" on:click={handleSave}>Save</button>
			</footer>
		</div>
	</div>
{/if}

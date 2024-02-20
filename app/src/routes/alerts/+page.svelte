<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	const toastStore = getToastStore();
	const updateSuccessfulToast: ToastSettings = {
		timeout: 3000,
		message: 'Alerts updated successfully',
		background: 'variant-filled-secondary'
	};

	const updateFailedToast: ToastSettings = {
		timeout: 3000,
		message: 'Failed to update alerts. Please try again.',
		background: 'variant-filled-error'
	};

	export let data: PageData;
	$: alerts = data.alerts;

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
		console.log(response);

		if (response.ok) {
			toastStore.trigger(updateSuccessfulToast);
		} else {
			toastStore.trigger(updateFailedToast);
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
			toastStore.trigger(updateSuccessfulToast);
		} else {
			toastStore.trigger(updateFailedToast);
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

<section id="alerts">
	<div class="mx-auto w-full pb-8 pt-4 md:px-4 lg:max-w-7xl lg:pt-8">
		<ol class="breadcrumb px-4 pb-5 md:px-0 lg:text-lg">
			<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li class="text-surface-300">Alerts</li>
		</ol>

		<h1 class="h1 mb-4 text-center !text-3xl">Alerts</h1>
		<div class="flex max-h-full w-full justify-center px-2">
			<div class="card mt-4 w-full overflow-y-auto shadow-md md:px-4 md:py-2">
				{#if !alerts?.length}
					<p class="text-center">
						You don't have any alerts set up yet. Add one from the <a
							class="anchor"
							href="/snow-report"
							data-sveltekit-preload-data>Snow Report</a
						> page.
					</p>
				{:else}
					<div class="flex w-full flex-col p-4">
						{#each alerts as { id, display_name, threshold_inches }}
							<div class="mb-2 flex w-full items-center justify-between gap-4 md:gap-8">
								<p class="grow md:text-xl">{display_name}</p>
								<div class="flex md:w-1/4 md:shrink md:justify-end lg:w-1/6">
									<select
										class="select text-center"
										on:change={(e) => onThresholdChange(e, id)}
										value={threshold_inches}
									>
										<option value={1}>1+ in</option>
										<option value={3}>3+ in</option>
										<option value={6}>6+ in</option>
										<option value={12}>12+ in</option>
									</select>
								</div>

								<div class="flex shrink justify-end md:hidden">
									<button
										class="btn btn-icon btn-sm !bg-transparent pl-2"
										on:click={() => handleDelete(id)}><i class="fa fa-solid fa-trash" /></button
									>
								</div>
								<div class="hidden justify-end gap-4 md:flex md:shrink">
									<button class="variant-ghost-primary btn btn-sm" on:click={() => handleDelete(id)}
										>Delete <i class="fa fa-solid fa-trash ml-2" /></button
									>
								</div>
							</div>
							<hr class="my-3 w-full opacity-80 last:hidden" />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

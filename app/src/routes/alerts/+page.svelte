<script lang="ts">
	import {
		getModalStore,
		getToastStore,
		popup,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	const toastStore = getToastStore();
	const modalStore = getModalStore();
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

	const deleteAllModal: ModalSettings = {
		type: 'confirm',
		title: '<h3 class="h3 text-primary-500">Delete All Alerts</h3>',
		buttonTextConfirm: 'Delete Alerts',
		body: "If you want a break from our emails, you can pause your alerts instead. Are you sure you want to delete all of your alerts?",
		response: async (r: boolean) => {
			if (r) {
				await handleDeleteAll();
			}
		}
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
			toastStore.trigger(updateSuccessfulToast);
			alerts = [...alerts];
		} else {
			toastStore.trigger(updateFailedToast);
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
			toastStore.trigger(updateSuccessfulToast);
			alerts = [...pausedAlerts];
		} else {
			toastStore.trigger(updateFailedToast);
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
			toastStore.trigger(updateSuccessfulToast);
			alerts = [...resumedAlerts];
		} else {
			toastStore.trigger(updateFailedToast);
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
		{#if alerts.length}
			<!-- <div class="flex w-full justify-end px-4">
				<button type="button" class="variant-ghost-secondary btn btn-sm w-28 md:btn-md">
					<span>Add alerts</span>
					<i class="fa fa-bell"></i>
				</button>
			</div> -->
			
			<div class="flex max-h-full w-full justify-center px-2">
				<div class="card mt-4 w-full overflow-y-auto shadow-md md:px-4 md:py-2">
						<div class="flex w-full flex-col p-4">
							{#each alerts as { id, display_name, threshold_inches, paused }}
								<div
									class="flex w-full items-center justify-between gap-4 border-b border-b-surface-400 py-4 first:pt-0 last:border-b-0"
								>
									{#if paused}
										<p class="grow text-surface-400 md:text-xl">
											<i class="fa fa-pause pl-1"></i>
											{display_name}
										</p>
									{:else}
										<p class="grow md:text-xl">
											{display_name}
										</p>
									{/if}
									<div class="flex md:w-1/4 md:shrink md:justify-end lg:w-1/6">
										<select
											class="select py-1 text-center"
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
											class="btn btn-icon !bg-transparent"
											use:popup={{
												event: 'click',
												target: `alertMenuDropdown-${id}`,
												placement: 'bottom',
												closeQuery: '.listbox-item, .btn-icon'
											}}><i class="fa fa-ellipsis-v" /></button
										>
									</div>
									<span class="pr-4" aria-hidden data-popup="alertMenuDropdown-{id}">
										<div class="w-30 btn-group-vertical z-50 bg-surface-600 shadow-lg">
											{#if paused}
												<button class="listbox-item z-50" on:click={() => handlePause(id)}>
													<span>Resume</span>
													<i class="fa fa-play" />
												</button>
											{:else}
												<button class="listbox-item z-50" on:click={() => handlePause(id)}>
													<span>Pause</span>
													<i class="fa fa-pause" />
												</button>
											{/if}
											<button class="listbox-item z-50" on:click={() => handleDelete(id)}>
												<span>Delete</span>
												<i class="fa fa-trash" />
											</button>
										</div>
									</span>
									<div class="hidden justify-end gap-4 md:flex md:shrink">
										{#if paused}
											<button
												class="variant-filled-surface btn btn-sm"
												on:click={() => handlePause(id)}
											>
												<span>Resume</span>
												<i
													class="fa fa-play
											"
												/>
											</button>
										{:else}
											<button
												class="variant-filled-surface btn btn-sm"
												on:click={() => handlePause(id)}
											>
												<span>Pause</span>
												<i class="fa fa-pause" />
											</button>
										{/if}
									</div>
									<div class="hidden justify-end gap-4 md:flex md:shrink">
										<button
											class="variant-ghost-primary btn btn-sm"
											on:click={() => handleDelete(id)}
										>
											<span>Delete</span>
											<i class="fa fa-solid fa-trash" />
										</button>
									</div>
								</div>
							{/each}
						</div>
				</div>
			</div>

			<div class="flex w-full justify-center gap-2 px-2 pt-8">
				{#if !alerts?.every((a) => a.paused)}
				<button type="button" on:click={handlePauseAll} class="variant-filled-surface btn btn-sm md:btn-md w-32">
					<span>Pause all</span>
					<i class="fa fa-pause"></i>
				</button>
				{/if}
				{#if alerts?.every((a) => a.paused)}
				<button type="button" on:click={handleResumeAll} class="btn btn-sm variant-filled-surface w-32">
					<span>Resume all</span>
					<i class="fa fa-play"></i>
				</button>
				{/if}
				<button type="button" on:click={() => modalStore.trigger(deleteAllModal)} class="variant-ghost-primary btn btn-sm md:btn-md w-32">
					<span>Delete all</span>
					<i class="fa fa-trash"></i>
				</button>
			</div>
		{:else}
			<div class="flex flex-col w-full items-center justify-center gap-8 px-2 pt-8">
				<div class="alert variant-ghost-surface max-w-sm md:max-w-lg p-4">
					<span>
						<i class="fa fa-info-circle mx-1"></i>
						You don't have any alerts set up yet. You can add some here or from the <a
							class="anchor"
							href="/snow-report"
							data-sveltekit-preload-data>Snow Report</a
						> page for your favorite mountains.
					</span>
				</div>
				<button type="button" on:click={() => goto('/alerts/initial-setup')} class="variant-ghost-secondary btn btn-md w-32">
					<span>Add alerts</span>
					<i class="fa fa-bell"></i>
				</button>
			</div>
		{/if}
	</div>
</section>

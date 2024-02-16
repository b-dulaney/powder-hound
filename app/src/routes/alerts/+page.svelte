<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

    const toastStore = getToastStore();
    const updateSuccessfulToast: ToastSettings = {
        timeout: 3000,
        message: 'Alerts updated successfully',
        background: 'variant-filled-secondary'
    }

    const updateFailedToast: ToastSettings = {
        timeout: 3000,
        message: 'Failed to update alerts. Please try again.',
        background: 'variant-filled-error'
    }

    export let data: PageData;
    $: alerts = data.alerts;

    async function onThresholdChange(e: Event, id: number) {
        const { value } = e.target as HTMLSelectElement;
        const alertToUpdate = alerts?.find((a) => a.id === id);
        if(!alertToUpdate || !alerts) return;

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
        if(!alertToDelete || !alerts) return;
        const newAlerts = alerts.filter((a) => a.id !== id);
        
        const response = await fetch(`/api/alerts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if(response.ok) {
            alerts = newAlerts;
            toastStore.trigger(updateSuccessfulToast);
        } else {
            toastStore.trigger(updateFailedToast);
        
        }
    }
   
</script>

<svelte:head>
	<title>
		PowderHound - Manage your alerts
	</title>
</svelte:head>

<section id="alerts">
    <div class="mx-auto w-full lg:max-w-7xl md:px-4 pb-2 pt-4 md:pb-4 lg:pt-8">
        <ol class="breadcrumb lg:text-lg px-4 md:px-0 pb-5">
            <li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
            <li class="crumb-separator" aria-hidden>&rsaquo;</li>
            <li class="text-surface-300">Alerts</li>
        </ol>
        
        <h1 class="h1 text-center !text-3xl mb-4">Alerts</h1>
        <div class="w-full max-h-full flex justify-center">
            <div class="card mt-4 md:px-4 md:py-2 w-full overflow-y-auto">
                {#if !alerts?.length}
                    <p class="text-center">You don't have any alerts set up yet. Add one from the <a class="anchor" href="/conditions" data-sveltekit-preload-data>Conditions</a> page.</p>
                {:else}
                <div class="flex flex-col w-full p-4">
                {#each alerts as { id, display_name,  threshold_inches } }
                    <div class="flex justify-between w-full items-center mb-2 gap-4 md:gap-8">
                        <p class="md:text-xl grow">{display_name}</p>
                        <div class="flex md:shrink md:w-1/4 lg:w-1/6 md:justify-end">
                            <select class="select text-center" on:change={(e)=> onThresholdChange(e, id)} value={threshold_inches}>
                                <option value={1}>1+ inch</option>
                                <option value={3}>3+ inches</option>
                                <option value={6}>6+ inches</option>
                                <option value={12}>12+ inches</option>
                            </select>
                        </div>

                        <div class="flex shrink md:hidden justify-end">
                            <button class="btn btn-icon btn-sm pl-2 !bg-transparent" on:click={() => handleDelete(id)}><i class="fa fa-solid fa-trash" /></button>
                        </div>
                        <div class="hidden md:flex md:shrink justify-end gap-4">
                            <button class="btn btn-sm variant-ghost-primary" on:click={() => handleDelete(id)}>Delete <i class="fa fa-solid fa-trash ml-2" /></button>
                        </div>
                    </div>
                    <hr class="w-full opacity-80 my-3 last:hidden" />
                {/each}
                </div>
                {/if}
            </div>
        </div>
</section>
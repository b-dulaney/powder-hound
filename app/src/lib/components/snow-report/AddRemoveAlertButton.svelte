<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BackcountryDetail, ResortDetail, UserAlerts } from '$lib/supabase.types';
	import { addAlertFailedToast, addAlertSuccessfulToast, deleteAlertFailedToast, deleteAlertSuccessfulToast } from '$lib/utils';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { selectedMountain } from '../../../routes/snow-report/stores';
	export let existingAlert: boolean;
    export let session: Session | undefined;
    export let details: BackcountryDetail|ResortDetail;
    export let alertData: UserAlerts | undefined;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

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
			toastStore.trigger(deleteAlertSuccessfulToast);
		} else {
			toastStore.trigger(deleteAlertFailedToast);
		}
	}

	async function addAlert() {
		if (session) {
				selectedMountain.set(details);
				new Promise<boolean>((resolve) => {
					const alertModal: ModalSettings = {
						type: 'component',
						title: 'Add Alert',
						component: 'alertModal',
						meta: {
							user_id: session?.user.id,
							email: session?.user.email
						},
						response: (r: any) => {
							resolve(r);
						}
					};
					modalStore.trigger(alertModal);
				}).then(async (r: any) => {
					if (r.success) {
						existingAlert = true;
						alertData = r.alertData;
						toastStore.trigger(addAlertSuccessfulToast);
					} else if (r.error) {
						toastStore.trigger(addAlertFailedToast);
					}
				});
			} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	};
</script>

{#if existingAlert === false}
    <button type="button" on:click={addAlert} class="variant-ghost-secondary btn btn-sm md:btn-md w-32">
        <span>Add alert</span>
        <i class="fa fa-bell"></i>
    </button>
{/if}
{#if existingAlert === true}
    <button type="button" on:click={deleteAlert} class="variant-ghost-error btn btn-sm md:btn-md w-36">
        <span>Remove alert</span>
        <i class="fa fa-bell"></i>
    </button>
{/if}


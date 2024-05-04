<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BackcountryDetail, ResortDetail, UserAlerts } from '$lib/supabase.types';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { Session } from '@supabase/supabase-js';
	import { type ToastSettings, addToast } from '$lib/components/toasts';
	import { selectedMountain } from '../../../routes/snow-report/stores';

	// Props
	export let existingAlert: boolean;
	export let session: Session | undefined;
	export let details: BackcountryDetail | ResortDetail;
	export let alertData: UserAlerts | undefined;

	// Component variables
	const modalStore = getModalStore();
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
			addToast(deleteSuccessToast);
		} else {
			addToast(failureToast);
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
					addToast(updateSuccessToast);
				} else if (r.error) {
					addToast(failureToast);
				}
			});
		} else {
			goto(`/login?redirect=${$page.url.pathname}`);
		}
	}
</script>

{#if existingAlert === false}
	<button
		type="button"
		on:click={addAlert}
		class="variant-ghost-secondary btn btn-sm md:btn-md w-32"
	>
		<span>Add alert</span>
		<i class="fa fa-bell"></i>
	</button>
{/if}
{#if existingAlert === true}
	<button
		type="button"
		on:click={deleteAlert}
		class="variant-ghost-error btn btn-sm md:btn-md w-36"
	>
		<span>Remove alert</span>
		<i class="fa fa-bell"></i>
	</button>
{/if}

<script lang="ts">
	import type { PageData } from "./$types";
    import { invalidateAll } from '$app/navigation';
    import Card from '$lib/components/card.svelte';
    export let data: PageData;
    const { profile } = data;
    import dayjs from "dayjs";
	import type { ModalSettings, ToastSettings } from "@skeletonlabs/skeleton";
    import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
    let loading = false;
			
    const modalStore = getModalStore();
    const toastStore = getToastStore();
                        
    const unsubscribeSuccessfulToast: ToastSettings = {
        timeout: 3000,
        message: 'Successfully unsubscribed from email alerts',
        background: 'variant-filled-secondary'
    }

    const unsubscribeFailedToast: ToastSettings = {
        timeout: 3000,
        message: 'There was an error unsubscribing from email alerts. Please try again.',
        background: 'variant-filled-error'
    }

    const deleteAccountModal: ModalSettings = {
        type: 'confirm',
        title: '<h3 class="h3 text-primary-500">Delete Account</h3>',
        buttonTextConfirm: 'Delete',
        body: 'This action is permanent and cannot be undone. Are you sure you wish to proceed?',
        response: async (r: boolean) => {
            if (r) {
            const response = await fetch('/api/delete-account', {
                method: 'POST',
                body: JSON.stringify({ userId: profile?.user_id }),
            }) 
            if(response.status === 200){
                    invalidateAll();
            }
            }
        },
    };

    function handleDeleteAccount() {
        modalStore.trigger(deleteAccountModal);
    }

    async function handleUnsubscribe() {
        loading = true;
        const response = await fetch('/api/unsubscribe-from-alerts', {
            method: 'POST',
            body: JSON.stringify({ userId: profile?.user_id }),
        })

        const data = await response.json();
        loading = false;
        if (data?.success) {
            toastStore.trigger(unsubscribeSuccessfulToast);
        } else {
            toastStore.trigger(unsubscribeFailedToast);
        }

    }

</script>

<svelte:head>
	<title>
		PowderHound | Settings
	</title>
    <meta name="theme-color" content="#D4163C">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:site_name" content="PowderHound" />
    <meta name="description" content="Manage your PowderHound account and data">
    <meta property="og:title" content="PowderHound | Settings" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/settings" />
	<meta property="og:image" content='https://powderhound.io/og?title=Settings' />
    <meta property="og:image:type" content="image/png">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
</svelte:head>

<section id="profile">
    <div class="mx-auto w-full lg:max-w-7xl md:px-4 pt-4 pb-8 lg:pt-8">
        <ol class="breadcrumb lg:text-lg px-4 md:px-0 pb-5">
            <li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
            <li class="crumb-separator" aria-hidden>&rsaquo;</li>
            <li class="text-surface-300">Settings</li>
        </ol>
        <h1 class="h1 text-center !text-3xl">Settings</h1>
        <div class="w-full max-h-full flex justify-center p-4 md:px-0">
            <Card>
                <svelte:fragment slot="body">
                        <div class="flex flex-col w-full px-4 pb-4">
                            <h4 class="h4">Profile Info</h4>
                            <hr class="w-full opacity-80 mt-1 mb-4" />
                            <div class="flex flex-col w-full gap-4 pb-8">
                                <input id="userId" name="userId" value={profile?.user_id} hidden aria-hidden readonly />
                                <label for="email" class="label max-w-sm">
                                    <span>Email</span>
                                    <input type="email" id="email" name="email" class="input" value={profile?.email} readonly />
                                </label>
                                <label for="createdAt" class="label max-w-sm">
                                    <span>Account created</span>
                                    <input type="text" id="createdAt" name="createdAt" class="input" value={dayjs(profile?.created_at).format('MMMM D, YYYY')} readonly />
                            </div>
                            <h4 class="h4">Manage Data</h4>
                            <hr class="w-full opacity-80 mt-1 mb-4" />
                            <div class="flex flex-col gap-2">
                                <p class="text-sm py-2">Unsubscribe from all PowderHound email alerts. You will still be able to receive email login links.</p>
                                <button class="btn btn-sm variant-filled-surface !text-primary-400 w-[180px]" on:click={handleUnsubscribe} disabled={loading}>Unsubscribe from alerts</button>
                                <p class="text-sm py-2">Delete your account and all associated data. This action cannot be undone.</p>
                                <button class="btn btn-sm variant-ghost-primary w-[150px]" on:click={handleDeleteAccount} disabled={loading}>Delete account</button>
                            </div>
                        </div>
                </svelte:fragment>
            </Card>
        </div>
    </div>
</section>
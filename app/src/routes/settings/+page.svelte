<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import Card from '$lib/components/card.svelte';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	export let data: PageData;
	const { profile } = data;
	import dayjs from 'dayjs';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import { Button, Heading, Input, Label, P, Span } from 'flowbite-svelte';
	import { addToast, type ToastSettings } from '$lib/components/toasts';
	let loading = false;

	const modalStore = getModalStore();

	const unsubscribeSuccessfulToast: ToastSettings = {
		timeout: 3000,
		message: 'Successfully unsubscribed.',
		type: 'success'
	};

	const unsubscribeFailedToast: ToastSettings = {
		timeout: 5000,
		message: 'Failed to unsubscribe from email alerts. Please try again.',
		type: 'error'
	};

	const deleteAccountModal: ModalSettings = {
		type: 'confirm',
		title: '<h3 class="h3 text-primary-500">Delete Account</h3>',
		buttonTextConfirm: 'Delete',
		body: 'This action is permanent and cannot be undone. Are you sure you wish to proceed?',
		response: async (r: boolean) => {
			if (r) {
				const response = await fetch('/api/delete-account', {
					method: 'POST',
					body: JSON.stringify({ userId: profile?.user_id })
				});
				if (response.status === 200) {
					invalidateAll();
				}
			}
		}
	};

	function handleDeleteAccount() {
		modalStore.trigger(deleteAccountModal);
	}

	async function handleUnsubscribe() {
		loading = true;
		const response = await fetch('/api/unsubscribe-from-alerts', {
			method: 'POST',
			body: JSON.stringify({ userId: profile?.user_id })
		});

		const data = await response.json();
		loading = false;
		if (data?.success) {
			addToast(unsubscribeSuccessfulToast);
		} else {
			addToast(unsubscribeFailedToast);
		}
	}
</script>

<svelte:head>
	<title>PowderHound | Settings</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta name="description" content="Manage your PowderHound account and data" />
	<meta property="og:title" content="PowderHound | Settings" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/settings" />
	<meta property="og:image" content="https://powderhound.io/og?title=Settings" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<PageHeading title="Settings" />

<SectionContainer id="settings">
	<div class="flex w-full items-center justify-center">
		<Card showHeader={false}>
			<svelte:fragment slot="body">
				<div class="flex w-full flex-col p-4 md:p-6">
					<Heading tag="h2" class="text-lg font-semibold sm:text-2xl">Profile Info</Heading>
					<hr class="mb-4 mt-1 w-full opacity-80" />
					<div class="flex w-full flex-col gap-4 pb-8">
						<input id="userId" name="userId" value={profile?.user_id} hidden aria-hidden readonly />
						<Label class="space-y-1">
							<Span>Email</Span>
							<Input
								type="email"
								id="email"
								name="email"
								class="max-w-sm dark:bg-surface-800"
								value={profile?.email}
								readonly
							/>
						</Label>
						<Label class="space-y-1">
							<Span>Account created</Span>
							<Input
								type="text"
								id="createdAt"
								name="createdAt"
								class="max-w-sm dark:bg-surface-800"
								value={dayjs(profile?.created_at).format('MMMM D, YYYY')}
								readonly
							/>
						</Label>
					</div>
					<Heading tag="h2" class="text-lg font-semibold sm:text-2xl">Manage Data</Heading>
					<hr class="mb-4 mt-1 w-full opacity-80" />
					<div class="flex flex-col gap-2">
						<P class="py-2 text-sm">
							Unsubscribe from all PowderHound email alerts. You will still be able to receive email
							login links.
						</P>
						<Button
							on:click={handleUnsubscribe}
							color="dark"
							class="max-w-[200px] font-semibold"
							disabled={loading}>Unsubscribe from alerts</Button
						>
						<P class="py-2 text-sm">
							Delete your account and all associated data. This action cannot be undone.
						</P>
						<Button
							on:click={handleDeleteAccount}
							color="none"
							class="max-w-[200px] border border-red-700 bg-red-300 font-semibold text-red-900 hover:bg-red-400 dark:bg-red-400 dark:text-red-950 dark:hover:bg-red-500"
							disabled={loading}>Delete account</Button
						>
					</div>
				</div>
			</svelte:fragment>
		</Card>
	</div>
</SectionContainer>

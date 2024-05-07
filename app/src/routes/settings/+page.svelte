<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	import Card from '$lib/components/card.svelte';
	import type { PageData } from './$types';

	import PageHeading from '$lib/components/PageHeading.svelte';
	import { addToast, type ToastSettings } from '$lib/components/toasts';
	import dayjs from 'dayjs';
	import { Button, Heading, Input, Label, Modal, P, Span } from 'flowbite-svelte';
	import ExclamationCircleOutline from 'flowbite-svelte-icons/ExclamationCircleOutline.svelte';

	export let data: PageData;
	const { profile } = data;

	let loading = false;
	let showModal = false;

	const unsubscribeSuccessfulToast: ToastSettings = {
		timeout: 3000,
		message: 'Successfully unsubscribed.',
		type: 'success'
	};

	const unsubscribeFailedToast: ToastSettings = {
		timeout: 5000,
		message: 'Failed to unsubscribe. Please try again.',
		type: 'error'
	};

	const deleteAccountFailed: ToastSettings = {
		timeout: 5000,
		message: 'Failed to delete account. Please try again.',
		type: 'error'
	};

	async function handleDeleteAccount() {
		const response = await fetch('/api/delete-account', {
			method: 'POST',
			body: JSON.stringify({ userId: profile?.user_id })
		});
		if (response.status === 200) {
			invalidateAll();
			goto('/login');
		} else {
			addToast(deleteAccountFailed);
		}
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
					<Heading tag="h2" class="text-lg font-semibold sm:text-2xl ">Profile Info</Heading>
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
							class="max-w-[200px]"
							disabled={loading}>Unsubscribe from alerts</Button
						>
						<P class="py-2 text-sm">
							Delete your account and all associated data. This action cannot be undone.
						</P>
						<Button
							on:click={() => (showModal = true)}
							color="red"
							outline
							class="max-w-[200px]"
							disabled={loading}>Delete account</Button
						>
					</div>
				</div>
			</svelte:fragment>
		</Card>
	</div>
</SectionContainer>

<Modal title="Delete account" bind:open={showModal} size="sm" autoclose outsideclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-red-600 dark:text-red-500" />
		<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-600">
			This action is permanent and cannot be undone. Are you sure you wish to proceed?
		</Heading>
		<Button color="alternative">No, cancel</Button>
		<Button color="red" class="ms-2" on:click={handleDeleteAccount}>Yes, delete account</Button>
	</div>
</Modal>

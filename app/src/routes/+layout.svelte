<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import AlertModal from '$lib/components/alert-modal.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		Modal,
		ProgressBar,
		Toast,
		initializeStores,
		storePopup,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import {
		Avatar,
		DarkMode,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		NavBrand,
		NavLi,
		NavUl,
		Navbar
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	$: activeUrl = $page.url.pathname;

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const modalRegiestry: Record<string, ModalComponent> = {
		alertModal: { ref: AlertModal }
	};

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.access_token !== session?.access_token) {
				invalidateAll();
			}
			if (event === 'SIGNED_OUT') {
				invalidateAll();
			}
			if (_session?.expires_at !== session?.expires_at) {
				invalidateAll();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	const logout = async () => {
		await supabase.auth.signOut();
		invalidateAll();
	};
</script>

<Modal components={modalRegiestry} />
<Toast />

<div class="flex min-h-screen flex-col">
	<Navbar
		let:NavContainer
		fluid
		class="border-b border-b-gray-200 bg-surface-50 dark:border-b-gray-700 dark:bg-surface-900"
	>
		<NavContainer class="max-w-screen-xl">
			<div class="flex items-center gap-2">
				<SidebarNav {session} {logout} />
				<NavBrand href="/">
					<enhanced:img
						src="../public/logo.png"
						alt="Powder Hound Logo"
						class="hidden h-10 w-10 sm:inline-block md:h-14 md:w-14"
					/>
					<p class="pl-1 text-xl font-bold text-gray-900 dark:text-white md:pl-2 md:text-2xl">
						PowderHound
					</p>
				</NavBrand>
			</div>
			<NavUl {activeUrl} ulClass="flex lg:text-lg justify-between my-0 font-semibold gap-4">
				<NavLi href="/">Home</NavLi>
				<NavLi href="/snow-report/resorts">Resorts</NavLi>
				<NavLi href="/snow-report/backcountry">Backcountry</NavLi>
				<NavLi href="/alerts">Alerts</NavLi>
			</NavUl>
			<div class="flex items-center justify-end gap-4 md:gap-8">
				<DarkMode size="lg" btnClass="focus:ring-2 rounded-lg" />
				{#if session?.user?.user_metadata?.avatar_url}
					<Avatar
						class="cursor-pointer"
						id="avatar-menu"
						src={session.user.user_metadata.avatar_url}
					/>
				{:else if session?.user?.email}
					<Avatar class="cursor-pointer capitalize" id="avatar-menu" initials
						>{session.user.email[0]}</Avatar
					>
				{:else}
					<Avatar class="cursor-pointer" id="avatar-menu" />
				{/if}
			</div>
			{#if session}
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownItem href="/settings">Settings</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={logout}>Sign out</DropdownItem>
				</Dropdown>
			{:else}
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownItem href="/signup">Sign up</DropdownItem>
					<DropdownItem href="/login">Login</DropdownItem>
				</Dropdown>
			{/if}
		</NavContainer>
	</Navbar>
	{#if $navigating}
		<ProgressBar height="h-1" meter="bg-primary-500" />
	{/if}

	<main class="flex grow flex-col">
		<slot />
	</main>

	<Footer />
</div>

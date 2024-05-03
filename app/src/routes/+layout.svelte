<script lang="ts">
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import AlertModal from '$lib/components/alert-modal.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		Modal,
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
		Navbar,
		Progressbar,
		Spinner
	} from 'flowbite-svelte';
	import ChevronDownOutline from 'flowbite-svelte-icons/ChevronDownOutline.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import '../app.css';
	import type { PageData } from './$types';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import { cubicOut, cubicIn, sineOut } from 'svelte/easing';

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	$: activeUrl = $page.url.pathname;

	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

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

	const logout = async () => {
		await supabase.auth.signOut();
		invalidateAll();
	};
</script>

<Modal components={modalRegiestry} />
<Toast />

<!-- Loading indicator for navigation on all pages -->
<div class="absolute top-0 z-50 mx-auto w-full">
	{#if $navigating}
		<Progressbar
			progress={100}
			animate
			precision={2}
			tweenDuration={1000}
			easing={sineOut}
			size="h-1"
			class="z-50"
		/>
	{/if}
</div>
<div class="flex min-h-screen flex-col">
	<Navbar let:NavContainer fluid class="bg-surface-50">
		<NavContainer class="max-w-screen-2xl">
			<div class="flex items-center gap-2">
				<SidebarNav {session} {logout} />
				<NavBrand href="/">
					<enhanced:img
						src="../public/logo.png"
						alt="Powder Hound Logo"
						class="hidden h-10 w-10 sm:inline-block md:h-14 md:w-14"
					/>
					<p class="pl-1 text-xl font-bold text-surface-900 dark:text-white md:pl-2 md:text-2xl">
						PowderHound
					</p>
				</NavBrand>
			</div>
			<div class="flex items-center justify-end gap-4 md:gap-8">
				<NavUl {activeUrl} ulClass="flex lg:text-lg justify-between my-0 font-semibold gap-4">
					<NavLi href="/">Home</NavLi>
					<NavLi class="cursor-pointer ">
						Snow Report<ChevronDownOutline
							class="ms-2 inline h-6 w-6 text-primary-800 dark:text-surface-100"
						/>
					</NavLi>
					<Dropdown class="z-20 w-44 rounded-lg ">
						<DropdownItem href="/snow-report/resorts">Resorts</DropdownItem>
						<DropdownItem href="/snow-report/backcountry">Backcountry</DropdownItem>
					</Dropdown>
					<NavLi href="/alerts">Alerts</NavLi>
				</NavUl>
				<DarkMode
					size="lg"
					btnClass="focus:ring-2 rounded-lg text-surface-600 dark:text-surface-400"
				/>
				{#if session?.user?.user_metadata?.avatar_url}
					<Avatar
						class="cursor-pointer ring-primary-300 hover:ring-2"
						id="avatar-menu"
						src={session.user.user_metadata.avatar_url}
					/>
				{:else if session?.user?.email}
					<Avatar
						class="cursor-pointer capitalize ring-primary-300 hover:ring-2"
						id="avatar-menu"
						initials>{session.user.email[0]}</Avatar
					>
				{:else}
					<Avatar class="cursor-pointer ring-primary-300 hover:ring-2" id="avatar-menu" />
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
					<DropdownItem href="/sign-up">Sign up</DropdownItem>
					<DropdownItem href="/login">Login</DropdownItem>
				</Dropdown>
			{/if}
		</NavContainer>
	</Navbar>

	<Breadcrumbs />

	<main class="flex grow flex-col">
		{#key data.pathname}
			<div
				in:fade={{ easing: cubicOut, duration: 200, delay: 300 }}
				out:fade={{ easing: cubicIn, duration: 200 }}
			>
				<slot />
			</div>
		{/key}
	</main>

	<Footer />
</div>

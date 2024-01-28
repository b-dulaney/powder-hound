<script lang="ts">
	import { AppBar, AppShell, Avatar, Drawer, ProgressBar, Toast, getDrawerStore, popup, storePopup, type DrawerSettings, type PopupSettings, Modal } from '@skeletonlabs/skeleton';
	import '../app.css';

	import { afterNavigate, goto, invalidate, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/stores';
	import SidebarNav from '$lib/components/sidebar-nav.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const drawerSettings: DrawerSettings = {
		width: 'w-[280px] md:w-[480px]'
	}
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open(drawerSettings);
	}

	function drawerClose(): void {
		drawerStore.close();
	}

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
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

	const userDropdown: PopupSettings = {
		event: 'click',
		target: 'userDropdown',
		placement: 'bottom',
		closeQuery: '.listbox-item, .btn-icon'
	};

	const logout = async () => {
		await supabase.auth.signOut();
		drawerStore.close();
		invalidateAll();
	};
</script>


<Modal />
<Toast />
<Drawer>
	<SidebarNav session={session} drawerClose={drawerClose} logout={logout} />
</Drawer>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<button on:click={drawerOpen} type="button" aria-label="Menu" class="btn-icon !bg-transparent md:hidden"><i class="fa fa-solid fa-bars text-xl" /></button>
				<a href="/" title="Go to Homepage" class="flex items-center">
					<enhanced:img src="../public/new-logo-v2.png" alt="Powder Hound Logo" class="h-10 w-10 md:h-12 md:w-12" />
					<p class="pl-1 md:pl-2 text-xl font-bold md:text-2xl">Powder<span class="gradient-heading">Hound</span></p>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="hidden md:flex items-center justify-between">
					<a href="/conditions" class="btn btn-lg !bg-transparent" data-sveltekit-preload-data>Conditions</a>
					<a href="/alerts" class="btn btn-lg !bg-transparent" data-sveltekit-preload-data>Alerts</a>
				</div>
				<div class="flex items-center justify-end">
					<button aria-label="Profile" type="button" class="btn-icon" use:popup={userDropdown}>
						{#if session?.user?.user_metadata?.avatar_url}
							<Avatar src={session.user.user_metadata.avatar_url} />
						{:else if session?.user?.email}
							<Avatar initials={session?.user?.email[0]} background="bg-secondary-500"/>
						{:else}
						<i class="fa-solid fa-circle-user text-3xl md:text-4xl" />
						{/if}
					</button>
				</div>
				<span class="pr-8" aria-hidden data-popup="userDropdown">
					{#if session}
						<div class="btn-group-vertical w-24 bg-surface-600 shadow-xl">
							<button class="listbox-item" on:click={() => goto('/settings')}>Settings</button>
							<button class="listbox-item" on:click={logout}>Logout</button>
						</div>
					{:else}
						<div class="btn-group-vertical w-24 bg-surface-600 shadow-xl z-10 opacity-100">
							<button class="listbox-item z-10 opacity-100" on:click={() => goto('/signup')}>Sign up</button>
							<button class="listbox-item z-10 opacity-100" on:click={() => goto('/login')}>Login</button>
						</div>
					{/if}
				</span>
			</svelte:fragment>
		</AppBar>
		{#if $navigating}
			<ProgressBar height="h-1" meter="bg-primary-500" />
		{/if}
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<div
			class="page-footer border-t border-surface-500/10 text-xs dark:bg-surface-900 md:text-base"
		>
			<div class="mx-auto w-full max-w-6xl space-y-10 p-4 py-8">
				<section class="flex flex-col items-center justify-between space-y-5 md:space-y-0">
					<div class="grid grid-cols-1 place-content-center place-items-center gap-2">
						<enhanced:img src='../public/new-logo-v2.png' alt="Powder Hound Logo" class="h-10 w-10" />
						<p class="text-sm opacity-80">PowderHound</p>
						<span class="variant-soft badge">0.0.1</span>
					</div>
				</section>
				<hr class="opacity-20" />
				<section class="flex flex-col items-center justify-between space-y-4 md:space-y-0">
					<p>
						<a
							class="anchor"
							href="https://github.com/b-dulaney/powder-hound/tree/master/app/LICENSE"
							target="_blank"
							rel="noreferrer">MIT License</a
						>
						<span class="mx-2 opacity-10">|</span>
						<a class="anchor" href="mailto:contact@powderhound.io" target="_blank" rel="noreferrer"
							>Contact</a
						>
						<span class="mx-2 opacity-10">|</span>
						<a class="anchor" href="/privacy-policy">Privacy Policy</a>
						<span class="mx-2 opacity-10">|</span>
						<a class="anchor" href="/terms-of-use">Terms of Use</a>
					</p>
				</section>
			</div>
		</div>
	</svelte:fragment>
</AppShell>

<script lang="ts">
	import { AppBar, AppShell, Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import '../app.css';
	import Logo from '../public/new-logo-v2.png';

	import { afterNavigate, goto, invalidate } from '$app/navigation';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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
		event: 'focus-click',
		target: 'userDropdown',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};

	injectSpeedInsights();
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" title="Go to Homepage" class="flex items-center">
					<img src={Logo} alt="Powder Hound Logo" class="h-10 w-10 md:h-12 md:w-12" />
					<p class="pl-2 text-xl font-bold md:text-2xl">PowderHound</p>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="flex items-center justify-end">
					<button type="button" class="btn-icon" use:popup={userDropdown}>
						{#if session?.user?.user_metadata?.avatar_url}
							<Avatar src={session.user.user_metadata.avatar_url} />
						{:else}
							<i class="fa-solid fa-circle-user text-3xl md:text-4xl" />
						{/if}
					</button>
				</div>
				<span class="pr-8" aria-hidden data-popup="userDropdown">
					{#if session}
						<div class="btn-group-vertical bg-surface-700 shadow-xl">
							<button class="listbox-item" on:click={() => goto('/settings')}>Settings</button>
							<button class="listbox-item" on:click={logout}>Logout</button>
						</div>
					{:else}
						<div class="btn-group-vertical bg-surface-700 shadow-xl">
							<button class="listbox-item" on:click={() => goto('/signup')}>Sign up</button>
							<button class="listbox-item" on:click={() => goto('/login')}>Login</button>
						</div>
					{/if}
				</span>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<div
			class="page-footer border-t border-surface-500/10 text-xs dark:bg-surface-900 md:text-base"
		>
			<div class="mx-auto w-full max-w-6xl space-y-10 p-4 py-8">
				<section class="flex flex-col items-center justify-between space-y-5 md:space-y-0">
					<div class="grid grid-cols-1 place-content-center place-items-center gap-2">
						<img src={Logo} alt="Powder Hound Logo" class="h-10 w-10" />
						<p class="text-sm opacity-80">Powder Hound</p>
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
					</p>
				</section>
			</div>
		</div>
	</svelte:fragment>
</AppShell>

<script lang="ts">
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import AlertModal from '$lib/components/alert-modal.svelte';
	import ToastContainer from '$lib/components/toasts/ToastContainer.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Modal, initializeStores, storePopup, type ModalComponent } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { Progressbar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { cubicIn, cubicOut, sineOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import type { PageData } from './$types';
	import Header from './Header.svelte';

	export let data: PageData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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
</script>

<Modal components={modalRegiestry} />

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
	<Header {supabase} {session} />
	<main class="flex grow flex-col">
		{#key data.pathname}
			<div
				in:fade={{ easing: cubicOut, duration: 200, delay: 300 }}
				out:fade={{ easing: cubicIn, duration: 200 }}
			>
				<slot />
				<ToastContainer />
			</div>
		{/key}
	</main>

	<Footer />
</div>

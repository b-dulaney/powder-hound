<script lang="ts">
	import { AppBar, AppShell, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import '../app.css';
	import Logo from '../public/new-logo-v2.png';

	import { afterNavigate } from '$app/navigation';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import type { AfterNavigate } from '@sveltejs/kit';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" title="Go to Homepage" class="flex items-center">
					<img src={Logo} alt="Powder Hound Logo" class="w-10 h-10 md:w-12 md:h-12" />
					<p class="text-xl md:text-2xl font-bold pl-2">PowderHound</p>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="flex justify-end items-center">
					<button type="button" class="btn-icon" use:popup={userDropdown}>
						<i class="fa-solid fa-circle-user text-3xl md:text-4xl" />
					</button>
				</div>
				<span class="pr-8" aria-hidden data-popup="userDropdown">
					<div class="btn-group-vertical bg-surface-700 shadow-xl">
						<button>Sign up</button>
						<button>Login</button>
					</div>
				</span>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<div
			class="page-footer dark:bg-surface-900 border-t border-surface-500/10 text-xs md:text-base"
		>
			<div class="w-full max-w-6xl mx-auto p-4 py-8 space-y-10">
				<section class="flex flex-col justify-between items-center space-y-5 md:space-y-0">
					<div class="grid grid-cols-1 gap-2 place-content-center place-items-center">
						<img src={Logo} alt="Powder Hound Logo" class="w-10 h-10" />
						<p class="text-sm opacity-80">Powder Hound</p>
						<span class="badge variant-soft">0.0.1</span>
					</div>
				</section>
				<hr class="opacity-20" />
				<section class="flex flex-col justify-between items-center space-y-4 md:space-y-0">
					<p>
						<a
							class="anchor"
							href="https://github.com/b-dulaney/powder-hound/tree/master/app/LICENSE"
							target="_blank"
							rel="noreferrer">MIT License</a
						>
						<span class="opacity-10 mx-2">|</span>
						<a class="anchor" href="mailto:contact@powderhound.io" target="_blank" rel="noreferrer"
							>Contact</a
						>
					</p>
				</section>
			</div>
		</div>
	</svelte:fragment>
</AppShell>

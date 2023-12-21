<script lang="ts">
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import Logo from '../public/powder-hound-logo-new.png';
	import '../app.css';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<i class="fa-solid fa-bars"></i>
			</svelte:fragment>
			<svelte:fragment slot="trail">Login</svelte:fragment>
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

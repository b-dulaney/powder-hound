<script lang="ts">
	export let drawerClose: () => void;
	export let logout: () => void;
	export let session: any;
	import { page } from '$app/stores';

	$: classesActive = (href: string) =>
		href === $page.url.pathname ? '!variant-filled-primary rounded-lg p-2' : '';
</script>

<section class="space-y-4 overflow-y-auto p-4 pb-20">
	<p class="pl-4 text-2xl font-bold">Snow Report</p>
	<nav class="list-nav">
		<ul>
			<li>
				<a
					class={classesActive('/snow-report/resorts')}
					href="/snow-report/resorts"
					on:click={drawerClose}
				>
					<span class="flex-auto">Resorts</span>
				</a>
			</li>
			<li>
				<a
					class={classesActive('/snow-report/backcountry')}
					href="/snow-report/backcountry"
					on:click={drawerClose}
				>
					<span class="flex-auto">Backcountry</span>
				</a>
			</li>
		</ul>
	</nav>
	<hr class="!my-6 opacity-50" />
	<p class="pl-4 text-2xl font-bold">Profile</p>
	<nav class="list-nav">
		{#if session}
			<ul>
				<li>
					<a class={classesActive('/alerts')} href="/alerts" on:click={drawerClose}>
						<span class="flex-auto">Alerts</span>
					</a>
				</li>
				<li>
					<a class={classesActive('/settings')} href="/settings" on:click={drawerClose}>
						<span class="flex-auto">Settings</span>
					</a>
				</li>
				<li>
					<button class="w-full text-start" on:click={logout}>
						<span class="flex-auto">Logout</span>
					</button>
				</li>
			</ul>
		{:else}
			<ul>
				<li>
					<a class={classesActive('/signup')} href="/signup" on:click={drawerClose}>
						<span class="flex-auto">Sign Up</span>
					</a>
				</li>
				<li>
					<a class={classesActive('/login')} href="/login" on:click={drawerClose}>
						<span class="flex-auto">Login</span>
					</a>
				</li>
			</ul>
		{/if}
	</nav>
	<hr class="!my-6 opacity-50" />
	<p class="pl-4 text-2xl font-bold">About</p>
	<nav class="list-nav">
		<ul>
			<li>
				<a href="https://github.com/b-dulaney/powder-hound" on:click={drawerClose}>
					<span class="flex-auto">Github</span>
				</a>
			</li>
			<li>
				<a
					href="mailto:contact@powderhound.com"
					target="_blank"
					rel="noopener"
					on:click={drawerClose}
				>
					<span class="flex-auto">Contact</span>
				</a>
			</li>
			<li>
				<a class={classesActive('/privacy-policy')} href="/privacy-policy" on:click={drawerClose}>
					<span class="flex-auto">Privacy Policy</span>
				</a>
			</li>
			<li>
				<a class={classesActive('/terms-of-use')} href="/terms-of-use" on:click={drawerClose}>
					<span class="flex-auto">Terms of Use </span>
				</a>
			</li>
		</ul>
	</nav>
</section>

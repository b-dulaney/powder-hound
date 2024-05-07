<script lang="ts">
	import { navigating, page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import {
		CloseButton,
		Drawer,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import SignOut from 'flowbite-svelte-icons/ArrowLeftToBracketOutline.svelte';
	import SignIn from 'flowbite-svelte-icons/ArrowRightToBracketOutline.svelte';
	import BellSolid from 'flowbite-svelte-icons/BellSolid.svelte';
	import CogSolid from 'flowbite-svelte-icons/CogSolid.svelte';
	import GithubSolid from 'flowbite-svelte-icons/GithubSolid.svelte';
	import HomeSolid from 'flowbite-svelte-icons/HomeSolid.svelte';
	import ScaleBalancedSolid from 'flowbite-svelte-icons/ScaleBalancedSolid.svelte';
	import ShieldSolid from 'flowbite-svelte-icons/ShieldSolid.svelte';
	import UserSolid from 'flowbite-svelte-icons/UserSolid.svelte';
	import { sineIn } from 'svelte/easing';
	import SkiLiftSolid from './icons/SkiLiftSolid.svelte';
	import PineTreeSolid from './icons/PineTreeSolid.svelte';

	// Props
	export let session: Session | null;
	export let logout: () => Promise<void>;
	// Component variables
	let hidden = true;
	let activeClass =
		'flex items-center transition duration-75 p-2 text-base font-normal text-primary-900 bg-primary-100 dark:bg-primary-500 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-surface-700';
	let nonActiveClass =
		'flex items-center transition duration-75 p-2 text-base font-normal  rounded-lg dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700';
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	// State
	$: activeUrl = $page.url.pathname;

	$: if ($navigating) {
		hidden = true;
	}
</script>

<button
	on:click={() => (hidden = false)}
	data-drawer-target="sidebar"
	data-drawer-toggle="sidebar"
	aria-controls="sidebar"
	type="button"
	class="inline-flex items-center rounded-lg p-2 text-sm hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-surface-200 dark:text-surface-400 dark:hover:bg-surface-700 dark:focus:ring-surface-600 md:hidden"
>
	<span class="sr-only">Open sidebar</span>
	<svg
		class="h-6 w-6"
		aria-hidden="true"
		fill="currentColor"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			clip-rule="evenodd"
			fill-rule="evenodd"
			d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
		></path>
	</svg>
</button>
<Drawer
	bgColor="bg-surface-900"
	divClass="overflow-y-auto z-50 p-4 bg-white dark:bg-surface-800"
	transitionType="fly"
	{transitionParams}
	bind:hidden
	id="sidebar"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="text-base font-semibold uppercase text-surface-700 dark:text-surface-400"
		>
			Menu
		</h5>
		<CloseButton on:click={() => (hidden = true)} class="text-surface-700 dark:text-surface-400" />
	</div>
	<Sidebar {activeUrl} {activeClass} {nonActiveClass}>
		<SidebarWrapper
			divClass="overflow-y-auto py-4 px-3 rounded text-surface-700 dark:bg-surface-800"
		>
			<SidebarGroup>
				<SidebarItem label="Home" href="/">
					<svelte:fragment slot="icon">
						<HomeSolid />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Resorts" href="/snow-report/resorts">
					<svelte:fragment slot="icon">
						<SkiLiftSolid class="h-6 w-6" />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Backcountry" href="/snow-report/backcountry">
					<svelte:fragment slot="icon">
						<PineTreeSolid class="h-6 w-6" />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Alerts" href="/alerts">
					<svelte:fragment slot="icon">
						<BellSolid class=" h-6 w-6 " />
					</svelte:fragment>
				</SidebarItem>
				{#if !session}
					<SidebarItem label="Sign In" href="/login">
						<svelte:fragment slot="icon">
							<SignIn class=" h-6 w-6 " />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Sign Up" href="/sign-up">
						<svelte:fragment slot="icon">
							<UserSolid class=" h-6 w-6 " />
						</svelte:fragment>
					</SidebarItem>
				{:else}
					<SidebarItem label="Settings" href="/settings">
						<svelte:fragment slot="icon">
							<CogSolid class=" h-6 w-6 " />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Sign Out" on:click={logout}>
						<svelte:fragment slot="icon">
							<SignOut class=" h-6 w-6 " />
						</svelte:fragment>
					</SidebarItem>
				{/if}
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarItem label="Github" href="https://github.com/b-dulaney/powder-hound">
					<svelte:fragment slot="icon">
						<GithubSolid class=" h-6 w-6 " />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Privacy Policy" href="/privacy-policy">
					<svelte:fragment slot="icon">
						<ShieldSolid class=" h-6 w-6 " />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Terms of Use" href="/terms-of-use">
					<svelte:fragment slot="icon">
						<ScaleBalancedSolid class=" h-6 w-6 " />
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

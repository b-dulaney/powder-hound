<script lang="ts">
	import SidebarNav from '$lib/components/SidebarNav.svelte';
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		Dropdown,
		DropdownItem,
		DarkMode,
		Avatar,
		DropdownDivider
	} from 'flowbite-svelte';
	import ChevronDownOutline from 'flowbite-svelte-icons/ChevronDownOutline.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { invalidateAll } from '$app/navigation';

	// Props
	export let session: Session | null;
	export let supabase: SupabaseClient<any, 'public', any>;

	// Component state
	$: activeUrl = $page.url.pathname;

	// Handlers and functions
	const logout = async () => {
		await supabase.auth.signOut();
		invalidateAll();
	};
</script>

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

<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	export let form: ActionData;
	export let data: PageData;
	const { supabase } = data;

	const redirectUrl = $page.url.searchParams.get('redirect');
</script>

<svelte:head>
	<title>PowderHound | Login</title>
	<meta property="og:site_name" content="PowderHound" />
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="description"
		content="Login to PowderHound to get snowfall alerts for Colorado's premier ski destinations"
	/>
	<meta property="og:title" content="PowderHound | Login" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/login" />
	<meta property="og:image" content="https://powderhound.io/og?title=Login" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content="PowderHound | Login to get snowfall alerts for Colorado's premier ski destinations"
	/>
</svelte:head>

<div class="my-10 flex h-full items-start justify-center px-4">
	<Login action="login" {supabase} {form} {redirectUrl} />
</div>

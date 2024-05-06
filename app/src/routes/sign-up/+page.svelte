<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import type { PageData } from '../$types';
	import type { ActionData } from '../login/$types';

	export let form: ActionData;
	export let data: PageData;
	const { supabase } = data;
</script>

<svelte:head>
	<title>PowderHound | Sign Up</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta
		name="description"
		content="Sign Up for PowderHound to get snowfall alerts for Colorado's premier ski destinations"
	/>
	<meta property="og:title" content="PowderHound | Sign Up" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/sign-up" />
	<meta property="og:image" content="https://powderhound.io/og?title=Sign Up" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:description"
		content="Sign Up for PowderHound to get snowfall alerts for Colorado's premier ski destinations"
	/>
</svelte:head>

<div class="flex min-h-[700px] grow flex-col items-center justify-center px-4 py-6 sm:py-10">
	<Login action="signup" {supabase} {form} />
</div>

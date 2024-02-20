<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import type { PageData } from '../$types';
	import type { ActionData } from './$types';

	export let form: ActionData;
	export let data: PageData;
	const { supabase } = data;

</script>

<svelte:head>
	<title>
		PowderHound | Sign Up
	</title>
	<meta name="theme-color" content="#D4163C">
	<meta name="twitter:card" content="summary_large_image">
	<meta property="og:site_name" content="PowderHound" />
	<meta name="description" content="Sign Up for PowderHound to get snowfall alerts for Colorado's premier ski destinations">
	<meta property="og:title" content="PowderHound | Sign Up" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/signup" />
	<meta property="og:image" content='https://powderhound.io/og?title=Sign Up' />
	<meta property="og:image:type" content="image/png">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:description" content="Sign Up for PowderHound to get snowfall alerts for Colorado's premier ski destinations" />
</svelte:head>

<div class="mt-10 flex h-full items-start justify-center px-4">
	<Login action="signup" supabase={supabase} form={form} />
</div>

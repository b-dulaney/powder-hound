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
		PowderHound - Login
	</title>
	<meta name="description" content="Login to PowderHound get snowfall alerts for Colorado's premier ski destinations">
</svelte:head>

<div class="mt-10 flex h-full items-start justify-center px-4">
	<Login action="login" supabase={supabase} form={form} />
</div>

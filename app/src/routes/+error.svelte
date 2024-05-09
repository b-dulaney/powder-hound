<script lang="ts">
	import { page } from '$app/stores';
	import { Section } from 'flowbite-svelte-blocks';
	import { Button, Heading, P } from 'flowbite-svelte';
</script>

<div class="flex flex-col items-center gap-8 p-8 text-center md:mt-12">
	<enhanced:img
		src="../public/error-logo.png"
		alt="Powder Hound Logo"
		class="h-40 w-40 md:h-56 md:w-56"
	/>
	<Heading tag="h1">Something went wrong ({$page.status})</Heading>
	<P size="xl" class="text-center">The hounds are hard at work looking for a fix.</P>
	<Button href="/" size="lg" color="dark">Back to Homepage</Button>
</div>

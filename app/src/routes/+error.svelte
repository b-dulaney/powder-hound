<script lang="ts">
	import { page } from '$app/stores';
	import { Section } from 'flowbite-svelte-blocks';
	import { Button, Heading, P } from 'flowbite-svelte';
</script>

<Section name="page404" id="error-section">
	<div class="mt-12 flex h-screen flex-col items-center gap-8 p-8 text-center">
		<enhanced:img src="../public/error-logo.png" alt="Powder Hound Logo" class="h-56 w-56" />
		<Heading tag="h1">Something went wrong ({$page.status})</Heading>
		<P size="xl">The hounds are hard at work looking for a fix.</P>
		<Button href="/" size="lg" color="dark">Back to Homepage</Button>
	</div>
</Section>

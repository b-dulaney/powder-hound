<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="mt-12 flex h-screen flex-col items-center gap-8 p-8 text-center">
	<enhanced:img src="../public/error-logo.png" alt="Powder Hound Logo" class="h-56 w-56" />
	<h1 class="h1">Something went wrong ({$page.status})</h1>
	<p class="h3">The hounds are hard at work looking for a fix.</p>
	<a class="anchor text-xl" href="/">Back to home page</a>
</div>

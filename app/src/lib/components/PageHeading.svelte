<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let title: string;
</script>

<Heading
	tag="h1"
	class="pt-4 text-center text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:py-8 sm:text-3xl sm:font-extrabold"
>
	{title}
</Heading>

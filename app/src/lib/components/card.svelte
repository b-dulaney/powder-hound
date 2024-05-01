<script lang="ts">
	import { Heading, P, Card } from 'flowbite-svelte';

	export let showFooter: boolean = false;
	export let showSubtitle: boolean = false;
	export let showHeader: boolean = true;
</script>

<Card size="lg" padding="lg">
	{#if showHeader}
		<Heading tag="h5">
			<slot name="header" />
		</Heading>
		{#if showSubtitle}
			<P class="text-surface-500">
				<slot name="header-subtitle" />
			</P>
		{/if}
	{/if}
	<slot name="body" />
	{#if showFooter}
		<P class="text-surface-500 dark:text-surface-400">
			<slot name="footer" />
		</P>
	{/if}
</Card>

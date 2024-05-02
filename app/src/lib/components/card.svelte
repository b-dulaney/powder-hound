<script lang="ts">
	import { Heading, P, Card } from 'flowbite-svelte';

	export let showFooter: boolean = false;
	export let showSubtitle: boolean = false;
	export let showHeader: boolean = true;
</script>

<Card
	size="none"
	padding="none"
	class="flex w-full flex-col divide-surface-200 rounded-lg border border-surface-200 bg-surface-50 text-surface-500 shadow-md dark:divide-surface-700 dark:border-surface-700 dark:bg-surface-950 dark:text-surface-400"
>
	{#if showHeader}
		<div
			class="rounded-t-lg border-b border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-900"
		>
			<Heading tag="h5">
				<slot name="header" />
			</Heading>
			{#if showSubtitle}
				<P class="text-surface-500">
					<slot name="header-subtitle" />
				</P>
			{/if}
		</div>
	{/if}
	<slot name="body" />
	{#if showFooter}
		<div
			class="rounded-b-lg border-t border-surface-200 bg-surface-50 p-5 dark:border-surface-700 dark:bg-surface-950"
		>
			<P class="mt-4 text-surface-500 dark:text-surface-400">
				<slot name="footer" />
			</P>
		</div>
	{/if}
</Card>

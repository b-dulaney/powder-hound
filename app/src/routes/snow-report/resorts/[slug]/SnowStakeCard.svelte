<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { SnowStakeCam } from '$lib/snow-stakes';
	import { tick } from 'svelte';
	import SnowStakeViewer from './SnowStakeViewer.svelte';

	export let cams: SnowStakeCam[];
	export let resortName: string;

	let selected = 0;
	let tabs: HTMLButtonElement[] = [];

	$: cam = cams[selected];

	// Tabs keyboard pattern: arrows, Home and End move between tabs and select them.
	async function onTabKeydown(event: KeyboardEvent) {
		const last = cams.length - 1;
		const next = {
			ArrowLeft: selected === 0 ? last : selected - 1,
			ArrowRight: selected === last ? 0 : selected + 1,
			Home: 0,
			End: last
		}[event.key];
		if (next === undefined) return;
		event.preventDefault();
		selected = next;
		await tick();
		tabs[next]?.focus();
	}
</script>

<Card>
	<svelte:fragment slot="header"
		>{cams.length === 1 ? cams[0].label : 'Snow Stakes'}</svelte:fragment
	>
	<svelte:fragment slot="body">
		{#if cams.length > 1}
			<div
				class="flex flex-wrap gap-2 px-4 pt-4 sm:px-6"
				role="tablist"
				aria-label="{resortName} snow stake cams"
			>
				{#each cams as c, i (c.id)}
					<button
						bind:this={tabs[i]}
						type="button"
						role="tab"
						id="stake-tab-{c.id}"
						aria-selected={i === selected}
						aria-controls="stake-panel"
						tabindex={i === selected ? 0 : -1}
						class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 {i ===
						selected
							? 'bg-surface-900 text-white dark:bg-surface-100 dark:text-surface-900'
							: 'bg-surface-200 text-surface-700 hover:bg-surface-300 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'}"
						on:click={() => (selected = i)}
						on:keydown={onTabKeydown}
					>
						{c.label}
					</button>
				{/each}
			</div>
		{/if}
		<div
			id="stake-panel"
			class="p-4 sm:p-6"
			role={cams.length > 1 ? 'tabpanel' : undefined}
			aria-labelledby={cams.length > 1 ? `stake-tab-${cam.id}` : undefined}
		>
			{#key cam.id}
				<SnowStakeViewer {cam} {resortName} />
			{/key}
		</div>
	</svelte:fragment>
</Card>

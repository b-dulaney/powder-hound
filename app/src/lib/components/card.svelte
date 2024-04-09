<script lang="ts">
	export let showFooter: boolean = false;
	export let showSubtitle: boolean = false;
	export let showHeader: boolean = true;
</script>

<div class="card w-full !rounded-lg border border-surface-500 !bg-surface-900 shadow-md">
	{#if showHeader}
		<div class="rounded-t-lg border-b border-b-surface-500 bg-surface-800 p-5">
			<h2 class="h3">
				<slot name="header" />
			</h2>
			{#if showSubtitle}
				<p class="text-surface-400">
					<slot name="header-subtitle" />
				</p>
			{/if}
		</div>
	{/if}
	<slot name="body" />
	{#if showFooter}
		<div class="rounded-b-lg border-t border-t-surface-500 bg-surface-900 p-5">
			<p class="text-surface-300">
				<slot name="footer" />
			</p>
		</div>
	{/if}
</div>

<script lang="ts">
	export let showFooter: boolean = false;
	export let showSubtitle: boolean = false;
	export let showHeader: boolean = true;
</script>

<div class="card w-full shadow-md !rounded-lg !bg-surface-900 border border-surface-500">
	{#if showHeader}
		<div class="p-5 bg-surface-800 border-b border-b-surface-500 rounded-t-lg">
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
		<div class="p-5 bg-surface-900 border-t border-t-surface-500 rounded-b-lg">
			<p class="text-surface-300">
				<slot name="footer" />
			</p>
		</div>
	{/if}
</div>

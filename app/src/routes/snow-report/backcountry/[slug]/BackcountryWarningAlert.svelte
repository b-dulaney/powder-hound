<script lang="ts">
	export let forecastUrl: string;
    export let displayName: string;
</script>

		<div class="alert variant-ghost-primary">
			<div class="flex flex-col">
				<span class="flex items-baseline justify-start"
					><i class="fa-solid fa-circle-exclamation px-2" /><strong class="whitespace-nowrap"
						>Backcountry Forecasts</strong
					></span
				>
				<p>
					These forecasts are for use by experienced backcountry riders. This
					summary is not a replacement for the detailed CAIC report. 
                    Read the full
					<a
						target="_blank"
						rel="noopener"
						class="anchor !text-surface-50"
						href={forecastUrl}>{displayName} report</a
					>
					before heading out.
				</p>
			</div>
		</div>

<style>
	p :global(a) {
		--tw-text-opacity: 1;
		color: rgb(var(--color-primary-500) / var(--tw-text-opacity));
		text-decoration-line: underline;
	}
	p :global(a:hover) {
		--tw-brightness: brightness(1.1);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
			var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
	}
</style>


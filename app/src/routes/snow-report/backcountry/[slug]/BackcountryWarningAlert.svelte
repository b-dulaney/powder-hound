<script lang="ts">
	import { A, Alert, P } from 'flowbite-svelte';

	export let forecastUrl: string;
	export let displayName: string;
</script>

<Alert border color="red" class="!w-auto dark:bg-red-900/30">
	<div class="flex flex-col gap-1">
		<span class="flex items-baseline justify-start"
			><i class="fa-solid fa-circle-exclamation mr-2" /><strong class="whitespace-nowrap"
				>Backcountry Forecasts</strong
			></span
		>
		<P size="sm" class="max-w-3xl text-inherit dark:text-inherit">
			These forecasts are for use by experienced backcountry riders. This summary is not a
			replacement for the detailed CAIC report. Read the full
			<A class="text-inherit underline dark:text-inherit" href={forecastUrl}>{displayName} report</A
			>
			before heading out.
		</P>
	</div>
</Alert>

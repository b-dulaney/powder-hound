<script lang="ts">
	import { A, Alert, P } from 'flowbite-svelte';

	export let forecastUrl: string;
	export let displayName: string;
</script>

<Alert border color="red" class="!w-auto dark:bg-red-900/20">
	<div class="flex flex-col gap-1">
		<span class="flex items-baseline justify-start"
			><i class="fa-solid fa-circle-exclamation mr-2" /><strong class="whitespace-nowrap"
				>Backcountry Forecasts</strong
			></span
		>
		<P class="max-w-screen-xl text-sm text-inherit dark:text-inherit lg:text-base">
			These forecasts are for use by experienced backcountry riders. This summary is not a
			replacement for the detailed CAIC report. Read the full
			<A class="text-inherit underline dark:text-white" href={forecastUrl}>{displayName} report</A>
			before heading out.
		</P>
	</div>
</Alert>

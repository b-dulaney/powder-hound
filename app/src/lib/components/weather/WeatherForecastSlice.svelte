<script lang="ts">
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import { formatDate } from '$lib/utils';
	import { P } from 'flowbite-svelte';
	export let high_temp: number;
	export let low_temp: number;
	export let weatherDesc: string;
	export let date: string;
</script>

<div class="flex w-full flex-col items-center justify-center">
	<P class="ml-1">{high_temp}&deg;</P>
	<P class="ml-1">{low_temp}&deg;</P>
	<WeatherIcon size="small" {weatherDesc} ignoreTimeOfDay={date !== 'Today'} />
	<P class="mt-2 text-xs text-surface-500 dark:text-surface-300 sm:text-sm">
		{formatDate(date, 'long')}
	</P>
</div>

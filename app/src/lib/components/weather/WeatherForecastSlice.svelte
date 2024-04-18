<script lang="ts">
	import WeatherIcon from '$lib/components/weather/WeatherIcon.svelte';
	import { formatDate } from '$lib/utils';
	export let high_temp: number;
	export let low_temp: number;
	export let weatherDesc: string;
	export let date: string;
</script>

<div class="mx-auto flex min-w-[35px] flex-col items-center">
	<p class="pl-1">{high_temp}&deg;</p>
	<p class="pl-1">{low_temp}&deg;</p>
	<WeatherIcon size="small" {weatherDesc} ignoreTimeOfDay={date !== 'Today'} />
	<p class="mt-2 text-xs text-surface-400 sm:text-sm">{formatDate(date, 'long')}</p>
</div>

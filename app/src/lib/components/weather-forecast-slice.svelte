<script lang="ts">
	import WeatherIcon from '$lib/components/weather-icon.svelte';
	export let high_temp: number;
	export let low_temp: number;
	export let snowfall: number;
	export let weatherDesc: string;
	export let date: string;
	
	const formatDate = (date: string) => {
		const options = { weekday: 'short', day: '2-digit', timeZone: 'America/Denver' } as const;
		const formattedDayOfTheWeek = new Date(`${date}T07:00:00Z`).toLocaleDateString(
			'en-US',
			options
		);
		const reversedFormat = formattedDayOfTheWeek.split(' ').reverse().join(' ');
		return reversedFormat;
	};
</script>

<div class="flex min-w-[35px] flex-col items-center">
	<p class="pl-1 ">{high_temp}&deg;</p>
	<p class="pl-1 ">{low_temp}&deg;</p>
	<WeatherIcon size="small" {weatherDesc} ignoreTimeOfDay={date !== 'Today'} />
	<p class="font-semibold {snowfall > 0 ? 'pl-1' : ''}">{snowfall ? `${snowfall}"` : '--'}</p>
	<p class="mt-2 text-xs text-surface-400 sm:text-sm">{date === 'Today' ? date : formatDate(date)}</p>
</div>

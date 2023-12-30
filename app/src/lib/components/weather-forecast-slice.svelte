<script lang="ts">
	import WeatherIcon from '$lib/components/weather-icon.svelte';
	export let high_temp: number;
	export let low_temp: number;
	export let weatherDesc: string;
	export let date: string;

	const today = new Date();
	const todayDateFormatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

	const formatDate = (date: string) => {
		const options = { weekday: 'short', day: '2-digit', timeZone: 'America/Denver' } as const;
		if (date === todayDateFormatted) {
			return 'Today';
		}
		const formattedDayOfTheWeek = new Date(`${date}T07:00:00Z`).toLocaleDateString(
			'en-US',
			options
		);
		const reversedFormat = formattedDayOfTheWeek.split(' ').reverse().join(' ');
		return reversedFormat;
	};
</script>

<div class="flex min-w-[35px] flex-col items-center">
	<p class="pl-1 font-semibold">{high_temp}&deg;</p>
	<p class="pl-1 font-semibold">{low_temp}&deg;</p>
	<WeatherIcon size="small" {weatherDesc} ignoreTimeOfDay={date !== todayDateFormatted} />
	<p class="mt-2 text-xs text-surface-400 sm:text-sm">{formatDate(date)}</p>
</div>

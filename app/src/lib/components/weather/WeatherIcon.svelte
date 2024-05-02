<script lang="ts">
	export let weatherDesc: string;
	export let ignoreTimeOfDay: boolean = false;
	export let size: 'small' | 'large' = 'large';
	export let datetime: Date = new Date();
	const time = datetime.getHours();
	const isDaytime = ignoreTimeOfDay || (time >= 7 && time <= 17);
	const textStyle = size === 'small' ? 'text-xl' : 'text-4xl';

	const weatherIcons: Record<string, string> = {
		haze: 'fa-smog',
		fog: 'fa-smog',
		isocloud: isDaytime ? 'fa-cloud-sun' : 'fa-cloud-moon',
		mslycldy: isDaytime ? 'fa-cloud' : 'fa-cloud-moon',
		ptlycldy: isDaytime ? 'fa-cloud-sun' : 'fa-cloud-moon',
		cloudy: isDaytime ? 'fa-cloud' : 'fa-cloud-moon',
		snow: 'fa-snowflake',
		snowshwr: 'fa-snowflake',
		rain: isDaytime ? 'fa-cloud-rain' : 'fa-cloud-moon-rain',
		rainshwr: isDaytime ? 'fa-cloud-rain' : 'fa-cloud-moon-rain',
		rainsnow: isDaytime ? 'fa-cloud-showers-heavy' : 'fa-cloud-moon-rain',
		frzrain: isDaytime ? 'fa-cloud-showers-heavy' : 'fa-cloud-moon-rain',
		clear: isDaytime ? 'fa-sun' : 'fa-moon'
	};
</script>

<i class="{textStyle} fa-solid text-surface-700 dark:text-surface-200 {weatherIcons[weatherDesc]}"
></i>

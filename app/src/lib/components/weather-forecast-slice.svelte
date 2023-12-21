<script lang="ts">
    import WeatherIcon from "$lib/components/weather-icon.svelte";
    export let high_temp: number;
    export let low_temp: number;
    export let weatherDesc: string;
    export let date: string;
    export let isLast: boolean;

    const formatDate = (date: string) => {
        const options = { weekday: 'short', day: '2-digit', timeZone: 'America/Denver' } as const;
        const today = new Date();
        const todayDateFormatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        if (date === todayDateFormatted) {
            return 'Today';
        }
        const formattedDayOfTheWeek = new Date(`${date}T07:00:00Z`).toLocaleDateString('en-US', options);
        const reversedFormat = formattedDayOfTheWeek.split(' ').reverse().join(' ');
        return reversedFormat;
    }
</script>

    <div class="flex flex-col items-center justify-center min-w-[35px]">
        <p class="font-semibold pl-1">{high_temp}&deg;</p>
        <p class="font-semibold pl-1">{low_temp}&deg;</p>
        <WeatherIcon size="small" weatherDesc={weatherDesc} />
        <p class="mt-2 text-xs sm:text-sm">{formatDate(date)}</p>
    </div>

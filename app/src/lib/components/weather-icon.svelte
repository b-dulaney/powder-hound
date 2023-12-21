<script lang="ts">
    export let weatherDesc: string;
    export let size: "small" | "large" = "large";
    export let datetime: Date = new Date();
    const time = datetime.getHours();
    const isDaytime = time >= 7 && time <= 17;
    const textStyle = size === 'small' ? 'text-xl' : 'text-3xl';

    const weatherIcons: Record<string, string> = {
        haze: 'fa-smog',
        fog: 'fa-smog',
        isocloud: isDaytime ? 'fa-cloud-sun' : 'fa-cloud-moon',
        mslycldy: isDaytime ? 'fa-cloud' : 'fa-cloud-moon',
        ptlycldy: isDaytime ? 'fa-cloud-sun' : 'fa-cloud-moon',
        cloudy: isDaytime ? 'fa-cloud' : 'fa-cloud-moon',
        snow: 'fa-snowflake',
        clear: isDaytime ? 'fa-sun' : 'fa-moon'
    };
</script>

<i class="{textStyle} fa-solid {weatherIcons[weatherDesc]}"></i>
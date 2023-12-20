<script lang="ts">
	import type { PageData } from "./$types";
    import Chart from 'chart.js/auto'
    import { onMount } from 'svelte';
    import WeatherIcon from "$lib/components/weather-icon.svelte";
    export let data: PageData
    const { mountainDetails } = data
    let recentChart;
    let upcomingChart

    onMount(() => {
        const recentSnowChart = document.getElementById('recent-snowfall-chart');
        const upcomingSnowChart = document.getElementById('upcoming-snowfall-chart');
        recentChart = new Chart(recentSnowChart, {
            type: 'bar',
            data: {
                labels: mountainDetails.previous_snowfall_totals.map((snowfall) => snowfall.date).slice(0, 7),
                datasets: [{
                    label: 'Snowfall (inches)',
                    data: mountainDetails.previous_snowfall_totals.map((snowfall) => snowfall.snowfall_total).slice(0, 7),
                    backgroundColor: ['rgba(54, 162, 235, 0.4)'],
                    borderColor: ['rgb(54, 162, 235)'],
                    borderWidth: 1,
                    maxBarThickness: 30
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, 
                        ticks: {
                            callback: function(value, index, values) {
                                return value + '"'
                            },
                            stepSize: 1,
                            maxTicksLimit: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
            }
        })

        upcomingChart = new Chart(upcomingSnowChart, {
            type: 'bar',
            data: {
                labels: mountainDetails.upcoming_snowfall_totals.map((snowfall) => snowfall.date).slice(-4),
                datasets: [{
                    label: 'Snowfall (inches)',
                    data: mountainDetails.upcoming_snowfall_totals.map((snowfall) => snowfall.snowfall_total).slice(-4),
                    backgroundColor: ['rgba(54, 162, 235, 0.4)'],
                    borderColor: ['rgb(54, 162, 235)'],
                    borderWidth: 1,
                    maxBarThickness: 30,
                    base: 0
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, 
                        ticks: {
                            callback: function(value, index, values) {
                                return value + '"'
                            },
                            stepSize: 1,
                            maxTicksLimit: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
            }
        })
    })

    
</script>

<section id="header-section" class="pt-8 px-4 lg:p-8 xl:p-16flex flex-col ">
    <h1 class="h1">{mountainDetails.display_name}</h1>
    <span class="flex items-center"><p class="font-bold mt-2 text-xl text-slate-400 mr-2">Region:</p><p class="text-xl font-bold mt-2">{mountainDetails.region}</p></span>
    {#if mountainDetails.location_type === "resort"}
        <div class="badge variant-ghost-primary capitalize mt-2 w-[80px]">{mountainDetails.location_type}</div>
    {:else}
        <div class="badge variant-ghost-success capitalize mt-2 w-[100px]">{mountainDetails.location_type}</div>
    {/if}
</section>
<section id="forecast-section" class="pt-8 px-4 lg:p-8 xl:p-16">
    <div class="flex justify-center mb-4">
        <h3 class="h3">Weather Forecast</h3>
    </div>
    <div class="card mt-4">
        <div class="flex flex-col">
            <div class="flex justify-between">
                <div class="flex flex-col p-4">
                    <p class="text-2xl font-bold">{mountainDetails.current_temperature}°</p>
                    <p class="text-xl capitalize font-bold">{mountainDetails.current_weather}</p>
                    <div class="flex">
                        <p class="font-semibold">High {mountainDetails.temperature_range[5].high_temp}&deg;</p>
                        <p class="font-semibold mx-2">&middot;</p>
                        <p class="font-semibold">Low {mountainDetails.temperature_range[5].low_temp}&deg;</p>
                    </div>
                    <p class="text-xl">
                </div>
                <div class="flex flex-col p-8 justify-center items-center">
                        <WeatherIcon weatherDesc={mountainDetails.current_weather} size="large" />
                </div>
            </div>
            <a class="anchor self-center mb-3" href="/conditions/{mountainDetails.slug}">View Hourly Forecast <span><i class="fa-solid fa-chevron-right"></i></span></a>    
        </div>

    </div>
</section>

<section id="snow-report" class="pt-8 px-4 lg:p-8 xl:p-16">
    <div class="flex justify-center mb-4">
        <h3 class="h3">Snow Report</h3>
    </div>
    <div class="card mt-4">
        <div class="flex flex-col items-center">
            <p class="text-xl font-bold mt-2">Last 7 Days</p>
            <div class="flex w-full justify-center items-center">
                <hr class="w-1/4 px-2 !border-slate-700"/>
                <p class="px-6 text-xl font-semibold">
                    {(mountainDetails.past7daysnowfall < 1 && mountainDetails.past7daysnowfall > 0) ? "< 1" : mountainDetails.past7daysnowfall}"
                </p>
                <hr class="w-1/4 px-2 !border-slate-700"/>
            </div>
        </div>
        <div class="w-full p-2" id="recent-snowfall-chart-container">
            <canvas id="recent-snowfall-chart"></canvas>
        </div>
    </div>

    <div class="card mt-8">
        <div class="flex flex-col items-center">
            <p class="text-xl font-bold mt-2">Next 72 Hours</p>
            <div class="flex w-full justify-center items-center">
                <hr class="w-1/4 px-2 !border-slate-700"/>
                <p class="px-6 text-xl font-semibold">
                    {(mountainDetails.next72hoursnowfall < 1 && mountainDetails.next72hoursnowfall > 0) ? "< 1" : mountainDetails.next72hoursnowfall}"
                </p>
                <hr class="w-1/4 px-2 !border-slate-700"/>
            </div>
        </div>
        <div class="w-full p-2" id="upcoming-snowfall-chart-container">
            <canvas id="upcoming-snowfall-chart"></canvas>
        </div>
    </div>
</section>

<script lang="ts">
	import type { StackedChartData } from '$lib/supabase.types';
	import { formatDate } from '$lib/utils';
	import { Chart } from 'flowbite-svelte';
	export let chartData: StackedChartData[];
	export let yDomainMax: number;
	export let dateFormat: 'long' | 'short' = 'short';

	const options = {
		series: [
			{
				name: 'Day',
				color: '#3b82f6',
				data: chartData.map((d) => d.daytimeSnowfall)
			},
			{
				name: 'Night',
				data: chartData.map((d) => d.nighttimeSnowfall),
				color: '#8b5cf6'
			}
		],
		chart: {
			sparkline: {
				enabled: false
			},
			type: 'bar',
			width: '100%',
			height: 300,
			toolbar: {
				show: false
			}
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					plotOptions: {
						bar: {
							columnWidth: '33%'
						}
					}
				}
			},
			{
				breakpoint: 768,
				options: {
					plotOptions: {
						bar: {
							columnWidth: '75%'
						}
					}
				}
			},
			{
				breakpoint: 640,
				options: {
					plotOptions: {
						bar: {
							columnWidth: '100%'
						}
					}
				}
			},
			{
				breakpoint: 476,
				options: {
					plotOptions: {
						bar: {
							columnWidth: '100%'
						}
					}
				}
			}
		],
		fill: {
			opacity: 1
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '33%',
				borderRadiusApplication: 'end',
				borderRadius: 6,
				dataLabels: {
					position: 'top'
				}
			}
		},
		legend: {
			show: true,
			position: 'bottom'
		},
		dataLabels: {
			enabled: false
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontFamily: 'Inter, sans-serif',
				cssClass: 'text-xs font-normal bg-surface-60 dark:bg-surface-800'
			}
		},
		xaxis: {
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				},
				formatter: function (value: string) {
					return formatDate(value, dateFormat);
				}
			},
			categories: chartData.map((d) => d.day),
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
		},
		yaxis: {
			tickAmount: 4,
			min: 0,
			max: yDomainMax,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				},
				formatter: (value: any) => {
					return `${value.toFixed(1)}"`;
				}
			}
		},
		grid: {
			show: true
		}
	};
</script>

<Chart {options} />

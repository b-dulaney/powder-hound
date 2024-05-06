import type { StackedChartData } from '$lib/supabase.types';
import { formatDate } from '$lib/utils';
import type { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';

type HourlyAccumulation = {
	datetime: string;
	accumulated_snowfall: number;
};

export function getForecastChartConfig(
	chartData: StackedChartData[],
	yDomain: number,
	dateFormat: 'short' | 'long'
): ApexOptions {
	return {
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
			position: 'bottom',
			onItemClick: {
				toggleDataSeries: false
			}
		},
		dataLabels: {
			enabled: false
		},
		tooltip: {
			shared: true,
			intersect: false,
			style: {
				fontFamily: 'Inter, sans-serif'
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
			min: 0,
			tickAmount: 2,
			forceNiceScale: true,
			max: yDomain,
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				},
				formatter: (value: number) => {
					return `${value.toFixed(1)}"`;
				}
			}
		},
		grid: {
			show: true
		},
		states: {
			hover: { filter: { type: 'none ' } },
			active: { filter: { type: 'none ' } }
		}
	};
}

export function getAccumulationChartConfig(
	hourlyAccumulation: HourlyAccumulation[],
	yDomain: number
): ApexOptions {
	return {
		chart: {
			height: 300,
			width: '100%',
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false
			},
			zoom: {
				enabled: false
			},
			toolbar: {
				show: false
			}
		},
		tooltip: {
			enabled: true,
			x: {
				formatter: (d: number) => dayjs(d).format('ddd DD ha')
			}
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.55,
				opacityTo: 0,
				shade: '#1C64F2',
				gradientToColors: ['#1C64F2']
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			width: 6
		},
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: {
				left: -10,
				right: 2
			}
		},
		series: [
			{
				name: 'Accumulated snowfall',
				data: hourlyAccumulation.map((v) => v.accumulated_snowfall),
				color: '#1A56DB'
			}
		],
		xaxis: {
			type: 'datetime',
			categories: hourlyAccumulation.map((v) => v.datetime),
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				},
				formatter: (d: string) => dayjs(d).format('ha').slice(0, -1)
			},
			axisBorder: {
				show: false
			},
			tooltip: { enabled: false },
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			min: 0,
			tickAmount: 3,
			forceNiceScale: true,
			max: yDomain,
			labels: {
				show: true,
				offsetX: -20,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				},
				formatter: (value: number) => {
					return `${value.toFixed(1)}"`;
				}
			}
		}
	};
}

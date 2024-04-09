<script lang="ts">
	import type { WebScraperOverview } from '$lib/supabase.types';

	export let data: WebScraperOverview;
	const {
		highest_failure_display_name_24h: highestFailure24HDisplayName,
		highest_failure_total_rows_24h: highestFailure24HCount,
		highest_failure_percentage_failed_24h: highestFailure24HPercentage,
		success_percentage_24h: successPercentage24H,
		overall_success_percentage: successPercentage
	} = data;

	function getColorForSuccessRate(percentage: number): string {
		if (percentage > 95) {
			return 'text-green-500';
		} else if (percentage > 90) {
			return 'text-yellow-500';
		} else {
			return 'text-red-500';
		}
	}

	function getColorForFailureRate(percentage: number): string {
		if (percentage < 5) {
			return 'text-green-500';
		} else if (percentage < 10) {
			return 'text-yellow-500';
		} else {
			return 'text-red-500';
		}
	}
</script>

<div class="card my-8">
	<div class="flex flex-col space-y-1.5 px-6 pt-6">
		<h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
			Service Health
		</h3>
		<p class="text-sm">All-time and recent scraper success rates.</p>
	</div>
	<div class="p-6">
		<div class="grid grid-cols-2 gap-4 md:w-1/2">
			<div>
				<div class="text-sm font-medium">Overall</div>
				<div class={`text-2xl font-semibold ${getColorForSuccessRate(successPercentage)}`}>
					{successPercentage}%
				</div>
			</div>
			<div>
				<div class="text-sm font-medium">Last 24 Hours</div>
				<div class={`text-2xl font-semibold ${getColorForSuccessRate(successPercentage24H)}`}>
					{successPercentage24H}%
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col space-y-1.5 p-6">
		<h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
			Service Degradation
		</h3>
		<p class="max-w-sm text-sm">
			Details on the worst-performing web scraper over the most recent 24 hour period.
		</p>
	</div>
	<div class="space-y-1.5 px-6 text-xl">{highestFailure24HDisplayName}</div>
	<div class="p-6">
		<div class="grid grid-cols-2 gap-4 md:w-1/2">
			<div>
				<div class="text-sm font-medium">Failures</div>
				<div class="text-2xl font-semibold">{highestFailure24HCount}</div>
			</div>
			<div>
				<div class="text-sm font-medium">Error Rate</div>
				<div class="flex gap-2">
					<div
						class={`text-2xl font-semibold ${getColorForFailureRate(highestFailure24HPercentage)}`}
					>
						{highestFailure24HPercentage}%
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

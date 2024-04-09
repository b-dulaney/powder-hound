<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import type { ResortDetail } from '$lib/supabase.types';
	import { timeFromNow } from '$lib/utils';
	import OpenArc from './open-arc.svelte';
	import SnowDisplay from './snow-display.svelte';
	export let resortDetails: ResortDetail;
	export let closed: boolean = false;
</script>

<Card showFooter>
	<svelte:fragment slot="header">Mountain Conditions</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="grid grid-cols-1 gap-2 p-6 sm:grid-cols-2">
			<div class="grid grid-cols-2 items-center gap-4 p-2">
				<OpenArc
					open={resortDetails?.lifts_open}
					total={resortDetails?.total_lifts}
					url={resortDetails.lifts_url}
					type="Lifts"
				/>
				<OpenArc
					open={resortDetails?.runs_open}
					total={resortDetails?.total_runs}
					url={resortDetails.trails_url}
					type="Runs"
				/>
			</div>
			<div class="ml-2 grid grid-cols-2 gap-x-4">
				<SnowDisplay value={resortDetails.base_depth} type="Base Depth" {closed} />
				<SnowDisplay value={resortDetails.snow_past_24h} type="Last 24 Hours" {closed} />
				<SnowDisplay value={resortDetails.snow_past_48h} type="Last 48 Hours" {closed} />
				{#if resortDetails?.snow_past_week !== null && resortDetails?.snow_past_week >= 0}
					<SnowDisplay value={resortDetails?.snow_past_week} type="Last 7 Days" {closed} />
				{/if}
				{#if resortDetails?.snow_total !== null && resortDetails.snow_total >= 0}
					<SnowDisplay value={resortDetails?.snow_total} type="Season Total" />
				{/if}
				{#if resortDetails?.snow_type}
					<div class="flex h-full flex-col items-start p-2 odd:col-span-2">
						<div class="text-start text-surface-200">
							<p>Snowpack</p>
							<p class="text-start text-2xl font-bold">
								{closed ? '--' : resortDetails.snow_type}
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		Last update: {timeFromNow(resortDetails.updated_at)}
	</svelte:fragment>
</Card>

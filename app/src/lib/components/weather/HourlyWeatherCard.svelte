<script lang="ts">
  
  
  import Card from '$lib/components/card.svelte';
  import type { BackcountryDetail, ResortDetail } from '$lib/supabase.types';
  import HourlyForecastList from '$lib/components/weather/HourlyForecastList.svelte';

  export let details: ResortDetail|BackcountryDetail;
</script>

<Card>
	<svelte:fragment slot="header">Hourly Forecast</svelte:fragment>
	<svelte:fragment slot="body">
		<div class="max-h-[500px] overflow-auto px-4 py-6">
			<HourlyForecastList {details} />
		</div>
	</svelte:fragment>
</Card>


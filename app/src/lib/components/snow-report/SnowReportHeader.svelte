<script lang="ts">
	import type { BackcountryDetail, ResortDetail, UserAlerts } from '$lib/supabase.types';
	import { Heading, P, Span } from 'flowbite-svelte';
	import AddAlertButton from '../AddAlertButton.svelte';
	import EditAlertButton from '../EditAlertButton.svelte';
	import type { Session } from '@supabase/supabase-js';
	import { stateCodeMap } from '$lib/utils';

	export let details: ResortDetail | BackcountryDetail;
	export let isResort: boolean;
	export let session: Session | null;
	export let alertData: UserAlerts | undefined;
	export let existingAlert: boolean;
	export let closed: boolean;
</script>

<div class="mx-auto flex w-full max-w-screen-xl flex-col justify-between p-2 md:gap-1 lg:py-3">
	<Heading
		tag="h1"
		class="mb-2 max-w-lg text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-3xl"
		>{details.display_name} Snow Report</Heading
	>
	<div class="flex w-full items-end justify-between">
		<div class="flex flex-col">
			{#if !isResort}
				<P class="text-sm sm:text-base">{stateCodeMap[details.state]}</P>
				<P class="text-sm sm:text-base">Region - {details.region}</P>
			{/if}
			{#if isResort}
				<Span class="flex items-center">
					<P class="mr-2 text-sm sm:text-base">{stateCodeMap[details.state]} -</P>
					<P class="text-sm sm:text-base">{details.region}</P>
				</Span>
				<Span class="flex items-center">
					<P class="mr-2 text-sm sm:text-base">Status:</P>
					{#if closed}
						<P class="text-sm font-semibold text-red-600 dark:text-red-400 sm:text-base">Closed</P>
					{:else}
						<P class="text-sm font-semibold text-green-600 dark:text-green-400 sm:text-base">Open</P
						>
					{/if}
				</Span>
			{/if}
		</div>

		{#if existingAlert}
			<EditAlertButton size="lg" {session} {alertData} />
		{:else}
			<AddAlertButton
				size="lg"
				{session}
				mountainID={details.mountain_id}
				displayName={details.display_name}
			/>
		{/if}
	</div>
</div>

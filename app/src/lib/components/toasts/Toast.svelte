<!-- Toast.svelte -->
<script lang="ts">
	import { Toast as FlowbiteToast, P } from 'flowbite-svelte';
	import CheckCircleSolid from 'flowbite-svelte-icons/CheckCircleSolid.svelte';
	import CloseCircleSolid from 'flowbite-svelte-icons/CloseCircleSolid.svelte';
	import ExclamationCircleSolid from 'flowbite-svelte-icons/ExclamationCircleSolid.svelte';
	import { onMount } from 'svelte';
	import { toastStore } from './toastStore';
	import type { Toast } from './types';
	export let toast: Toast;

	onMount(() => {
		setTimeout(() => {
			// Remove this toast after its timeout
			$toastStore = $toastStore.filter((t) => t.id !== toast.id);
		}, toast.timeout);
	});
</script>

{#if toast.type === 'success'}
	<FlowbiteToast color="green">
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="h-5 w-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		<P class="text-sm">{toast.message}</P>
	</FlowbiteToast>
{/if}
{#if toast.type === 'delete'}
	<FlowbiteToast color="green">
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="h-5 w-5" />
			<span class="sr-only">Delete icon</span>
		</svelte:fragment>
		<P class="text-sm">{toast.message}</P>
	</FlowbiteToast>
{/if}
{#if toast.type === 'error'}
	<FlowbiteToast color="red">
		<svelte:fragment slot="icon">
			<ExclamationCircleSolid class="h-5 w-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		<strong class="text-red-800 dark:text-red-400">Error: </strong><P class="text-sm"
			>{toast.message}</P
		>
	</FlowbiteToast>
{/if}

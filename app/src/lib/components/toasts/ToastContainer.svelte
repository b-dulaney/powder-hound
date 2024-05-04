<!-- ToastContainer.svelte -->
<script>
	import { toastStore } from './toastStore';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
</script>

<div class="mx-auto flex w-full flex-col items-center gap-2">
	{#each $toastStore as toast (toast.id)}
		<div
			id={toast.id.toString()}
			class={`toast toast-${toast.type}`}
			animate:flip
			in:fly={{ duration: 300, y: 100, easing: cubicInOut }}
			out:fly={{ duration: 300, y: -100, easing: cubicInOut }}
		>
			<Toast {toast} />
		</div>
	{/each}
</div>

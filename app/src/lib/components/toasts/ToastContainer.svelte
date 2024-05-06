<!-- ToastContainer.svelte -->
<script>
	import { toastStore } from './toastStore';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut, cubicOut } from 'svelte/easing';
</script>

<div class="fixed bottom-[5%] flex flex-col items-center justify-center gap-2">
	{#each $toastStore as toast (toast.id)}
		<div
			id={toast.id.toString()}
			class={`toast toast-${toast.type}`}
			animate:flip
			in:fly={{ duration: 300, y: 100, easing: cubicInOut }}
			out:fade={{ duration: 300, easing: cubicOut }}
		>
			<Toast {toast} />
		</div>
	{/each}
</div>

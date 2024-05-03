<script lang="ts">
	export let id: string;
</script>

<section {id} class="mx-auto flex w-full max-w-screen-2xl flex-col justify-center p-4 pb-8">
	<slot />
</section>

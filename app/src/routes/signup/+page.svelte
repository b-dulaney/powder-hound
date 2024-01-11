<script lang="ts">
	import Login from '$lib/components/login.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
	const { supabase } = data;

</script>

<div class="mt-10 flex h-full items-start justify-center px-4 md:mb-40 md:mt-20">
	<Login action="signup" supabase={supabase} />
</div>

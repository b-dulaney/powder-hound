<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData
</script>

<div class="mt-10 flex h-full items-start justify-center px-4 md:mb-40 md:mt-20">
    <p>{data.status}</p>
    <p>{data.body.message}</p>
</div>

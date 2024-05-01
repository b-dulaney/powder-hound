<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let title: string;
</script>

<Breadcrumb
	aria-label="Navigation breadcrumbs"
	solid
	class="rounded-none border-x-0 border-t-0"
	olClass="inline-flex items-center space-x-1 mx-auto w-full max-w-screen-2xl"
>
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem>{title}</BreadcrumbItem>
</Breadcrumb>

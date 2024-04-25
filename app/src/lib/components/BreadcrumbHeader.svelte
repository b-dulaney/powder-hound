<script lang="ts">
	export let title: string;
</script>

<section id="header-section" class="mx-auto w-full pt-4 md:px-4 lg:max-w-5xl lg:pt-8">
	<ol class="breadcrumb px-4 pb-5 md:px-0 lg:text-lg">
		<li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li class="capitalize text-surface-300">{title}</li>
	</ol>
	<div class="flex justify-center lg:mb-4">
		<h1 class="h2 capitalize">{title}</h1>
	</div>
</section>

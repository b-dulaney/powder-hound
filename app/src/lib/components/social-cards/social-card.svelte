<script lang="ts">
	export let pageTitle: string | undefined;
</script>

<div class="card-container">
	<div class="logo-container">
		<img
			src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-256px.png"
			alt="Powder Hound Logo"
			class="logo"
		/>
		<p class="app-title">Powder<span class="gradient-heading">Hound</span></p>
	</div>
	{#if pageTitle}
		<h1 class="h1">{pageTitle}</h1>
	{/if}
	<p class="app-description">
		Get real-time snow reports, accurate weather predictions, and customized snowfall alerts for
		Colorado - all 100% free.
	</p>
</div>
<div class="bottom-trim" />

<style>
	@font-face {
		font-family: 'Open Sans';
		src: url('/src/lib/OpenSans-Regular.ttf');
	}
	@font-face {
		font-family: 'Open Sans Bold';
		src: url('/src/lib/OpenSans-Bold.ttf');
	}
	@font-face {
		font-family: 'Open Sans SemiBold';
		src: url('/src/lib/OpenSans-SemiBold.ttf');
	}
	.card-container {
		@apply flex h-[622px] w-full flex-col items-start justify-center gap-2 p-8 px-16;
		background-color: #15171f;
	}
	.app-description {
		@apply h-20 max-w-5xl text-4xl;
		color: #dfe0e2;
		font-family: 'Open Sans';
	}

	.logo-container {
		@apply flex items-center gap-4;
	}

	.logo {
		@apply h-36 w-36;
	}

	h1 {
		@apply w-full max-w-full text-5xl;
		font-family: 'Open Sans Bold';
		color: #dfe0e2;
	}

	.bottom-trim {
		@apply flex h-2 w-full;
		background-color: #d4163c;
	}

	.app-title {
		@apply text-6xl;
		color: #dfe0e2;
		font-family: 'Open Sans Bold';
		font-weight: 800;
	}

	.gradient-heading {
		@apply text-6xl;
		color: #d4163c;
		font-family: 'Open Sans Bold';
		font-weight: 800;
		color: transparent;
		background-clip: text;
		background-image: linear-gradient(to bottom right, #e15c77, #d4163c);
	}
</style>

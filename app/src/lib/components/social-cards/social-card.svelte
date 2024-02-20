<script lang="ts">
	export let pageTitle: string | undefined;
</script>

<div class="card-container">
	<div class="logo-container">
		<img src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-256px.png" alt="Powder Hound Logo" class="logo" />
		<p class="app-title">Powder<span class="gradient-heading">Hound</span></p>
	</div>
	{#if pageTitle}
		<h1 class="h1">{pageTitle}</h1>
	{/if}
	<p class="app-description">Get real-time snow reports, accurate weather predictions, and customized snowfall alerts for Colorado - all 100% free.</p>
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
		@apply flex flex-col gap-2 justify-center items-start h-[622px] w-full p-8;
		background-color: #15171F;
	}
	.app-description {
		@apply text-3xl h-20 max-w-4xl;
		color: #DFE0E2;
		font-family: 'Open Sans';
	}

	.logo-container {
		@apply flex items-center gap-4;
	}

	.logo {
		@apply h-36 w-36;
	}

	h1 {
		@apply text-5xl w-full max-w-full;
		font-family: 'Open Sans Bold';
		color: #DFE0E2;
	}

	.bottom-trim {
		@apply flex w-full h-2;
		background-color: #D4163C;
	}

	.app-title {
		@apply text-6xl;
		color: #DFE0E2;
		font-family: 'Open Sans Bold';
		font-weight: 800;
	}
	
	.gradient-heading {
		@apply text-6xl;
		color: #D4163C;
		font-family: 'Open Sans Bold';
		font-weight: 800;
		color: transparent; 
		background-clip: text; 
		background-image: linear-gradient(to bottom right,#E15C77, #D4163C);  
	}

</style>
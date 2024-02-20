<script>
	export let mountainName = 'Copper Mountain';
	export let baseDepth = 50;
	export let runsOpenPct = 100;
	export let snowLast48Hrs = 12;
	export let snowLast24Hrs = 6;
	export let snowNext24Hrs = 1;
	export let snowNext72Hrs = 3;
</script>

<div class="card-container">
	<div class="logo-container">
		<img src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-256px.png" alt="Powder Hound Logo" class="logo" />
		<p class="app-title">Powder<span class="gradient-heading">Hound</span></p>
	</div>
	<h1 class="h1">{mountainName} Snow Report</h1>
	<div class="stats-container">
		<div class="stat">
			<p class="stat-value">{baseDepth} in</p>
			<p class="stat-label">Base Depth</p>
		</div>
		<div class="stat">
			<p class="stat-value">{runsOpenPct}%</p>
			<p class="stat-label">Runs Open</p>
		</div>
		<div class="stat">
			<p class="stat-value">{snowLast48Hrs} in</p>
			<p class="stat-label">Last 48 Hours</p>
		</div>
		<div class="stat">
			<p class="stat-value">{snowLast24Hrs} in</p>
			<p class="stat-label">Last 24 Hours</p>
		</div>
		<div class="stat">
			<p class="stat-value">{snowNext24Hrs} in</p>
			<p class="stat-label">Next 24 Hours</p>
		</div>
		<div class="stat">
			<p class="stat-value">{snowNext72Hrs} in</p>
			<p class="stat-label">Next 72 Hours</p>
		</div>
	</div>
</div>
<div class="bottom-trim"></div>

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
		@apply flex flex-col gap-1 justify-around items-start h-[622px] w-full p-8;
		background-color: #15171F;
	}

	.logo-container {
		@apply flex items-center gap-4;
	}

	.stats-container {
		@apply flex gap-8 max-w-full justify-start h-16;
	}

	.stat {
		@apply flex flex-col;
	}

	.stat-label {
		color: #DFE0E2;
		font-family: 'Open Sans';
		@apply text-2xl;
	}

	.stat-value {
		color: #DFE0E2;
		@apply text-3xl;
		font-family: 'Open Sans Bold';
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
		@apply text-5xl;
		color: #DFE0E2;
		font-family: 'Open Sans Bold';
		font-weight: 800;
	}
	
	.gradient-heading {
		@apply text-5xl;
		color: #D4163C;
		font-family: 'Open Sans Bold';
		font-weight: 800;
		color: transparent; 
		background-clip: text; 
		background-image: linear-gradient(to bottom right,#E15C77, #D4163C);  
	}

</style>
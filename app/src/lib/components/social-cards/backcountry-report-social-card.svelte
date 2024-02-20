<script>
	import { avalancheDangerRatingsMap } from '$lib/utils';

	export let mountainName = 'Berthoud Pass';
	export let avalancheDangerLevel = 3;
	export let snowLast7Days = 12;
	export let snowLast24Hrs = 6;
	export let snowNext24Hrs = 1;
	export let snowNext72Hrs = 3;

	const dangerRating = avalancheDangerRatingsMap[avalancheDangerLevel];
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
	<h1 class="h1">{mountainName} Snow Report</h1>
	<div class="stats-container">
		<div class="stat">
			<p class="avy-stat-value">
				{dangerRating}
				{#if avalancheDangerLevel === 0}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-considerable.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{:else if avalancheDangerLevel === 1}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-low.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{:else if avalancheDangerLevel === 2}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-moderate.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{:else if avalancheDangerLevel === 3}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-considerable.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{:else if avalancheDangerLevel === 4}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-high.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{:else if avalancheDangerLevel === 5}
					<img
						src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/avy-danger-extreme.png"
						alt={`Avalanche danger: ${avalancheDangerLevel}`}
						style="height: 40px"
					/>
				{/if}
			</p>
			<p class="stat-label">Avalanche Danger</p>
		</div>
		<div class="stat">
			<p class="stat-value">{snowLast7Days} in</p>
			<p class="stat-label">Last 7 Days</p>
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
		@apply flex h-[622px] w-full flex-col items-start justify-around gap-1 p-8;
		background-color: #15171f;
	}

	.logo-container {
		@apply flex items-center gap-4;
	}

	.stats-container {
		@apply flex h-20 max-w-full justify-start gap-8;
	}

	.stat {
		@apply flex flex-col;
	}

	.stat-label {
		color: #dfe0e2;
		font-family: 'Open Sans';
		@apply text-2xl;
	}

	.avy-stat-value {
		color: #dfe0e2;
		@apply flex items-baseline text-3xl;
		font-family: 'Open Sans Bold';
	}

	.stat-value {
		color: #dfe0e2;
		@apply text-3xl;
		font-family: 'Open Sans Bold';
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
		@apply text-5xl;
		color: #dfe0e2;
		font-family: 'Open Sans Bold';
		font-weight: 800;
	}

	.gradient-heading {
		@apply text-5xl;
		color: #d4163c;
		font-family: 'Open Sans Bold';
		font-weight: 800;
		color: transparent;
		background-clip: text;
		background-image: linear-gradient(to bottom right, #e15c77, #d4163c);
	}
</style>

<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
	import { loadSlim } from 'tsparticles-slim'; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
	let ParticlesComponent;

	onMount(async () => {
		const module = await import('svelte-particles');

		ParticlesComponent = module.default;
	});

	let particlesConfig = {
		fullScreen: {
			enable: false
		},
		interactivity: {
			events: {
				resize: {
					delay: 0,
					enable: true
				}
			}
		},
		particles: {
			color: {
				value: '#fefefe'
			},
			move: {
				direction: 'bottom',
				enable: true,
				outModes: 'out',
				speed: 1.5
			},
			number: {
				density: {
					enable: true,
					area: 450
				},
				value: 50
			},
			opacity: {
				value: 0.6
			},
			shape: {
				type: 'circle'
			},
			size: {
				value: 5
			},
			wobble: {
				enable: true,
				distance: 10,
				speed: 10
			},
			zIndex: {
				value: {
					min: 0,
					max: 100
				}
			}
		}
	};

	let onParticlesLoaded = (event) => {
		const particlesContainer = event.detail.particles;

		// you can use particlesContainer to call all the Container class
		// (from the core library) methods like play, pause, refresh, start, stop
	};

	let particlesInit = async (engine) => {
		// you can use main to customize the tsParticles instance adding presets or custom shapes
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		//await loadFull(main);
		await loadSlim(engine);
	};
</script>

<svelte:component
	this={ParticlesComponent}
	id="tsparticles"
	class="absolute top-0 -z-10 h-full w-full pr-5"
	options={particlesConfig}
	on:particlesLoaded={onParticlesLoaded}
	{particlesInit}
/>

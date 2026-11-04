<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	// Client-only: the particles engine touches the DOM, so load it after mount (not during SSR).
	let ParticlesComponent;

	onMount(async () => {
		const [{ default: Particles, initParticlesEngine }, { loadSlim }] = await Promise.all([
			import('@tsparticles/svelte'),
			import('@tsparticles/slim')
		]);
		await initParticlesEngine(async (engine) => {
			await loadSlim(engine);
		});
		ParticlesComponent = Particles;
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
				// v2 `area: 450` was an alias for width (height defaulted to 1080).
				density: {
					enable: true,
					width: 450,
					height: 1080
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
</script>

<svelte:component
	this={ParticlesComponent}
	id="tsparticles"
	class="absolute top-0 -z-10 h-full w-full pr-5"
	options={particlesConfig}
/>

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['tsparticles', 'tsparticles-slim', 'tsparticles-engine', 'svelte-particles']
	}
});

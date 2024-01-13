import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';
``;
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/layerchart/**/*.{svelte,js}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {},
	plugins: [forms, skeleton({ themes: { preset: [{ name: 'wintry', enhancements: true }] } })]
} satisfies Config;

export default config;

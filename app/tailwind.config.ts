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
	theme: {
		extend: {
			gridColumn: {
				'span-16': 'span 16 / span 16',
				'span-20': 'span 20 / span 20'
			},
			gridTemplateColumns: {
				'16': 'repeat(16, minmax(0, 1fr))',
				'20': 'repeat(20, minmax(0, 1fr))'
			}
		}
	},
	plugins: [forms, skeleton({ themes: { preset: [{ name: 'crimson', enhancements: true }] } })]
} satisfies Config;

export default config;

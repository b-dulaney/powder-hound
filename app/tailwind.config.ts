
import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
``
const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
	},
	plugins: [
		forms,
		skeleton({themes: {preset: [{name: "wintry", enhancements: true}]}})
	]
} satisfies Config;

export default config;
						
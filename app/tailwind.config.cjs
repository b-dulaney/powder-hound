/* eslint-disable @typescript-eslint/no-var-requires */
import forms from '@tailwindcss/forms';
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-blocks/**/*.{html,js,svelte,ts}',
		'./node_modules/layerchart/**/*.{svelte,js}'
	],
	theme: {
		extend: {
			gridColumn: {
				'span-16': 'span 16 / span 16',
				'span-20': 'span 20 / span 20'
			},
			gridTemplateColumns: {
				16: 'repeat(16, minmax(0, 1fr))',
				20: 'repeat(20, minmax(0, 1fr))'
			},
			colors: {
				primary: {
					50: '#F4EDF8',
					100: '#EBDEF2',
					200: '#D7BEE5',
					300: '#C39DD7',
					400: '#AD79C9',
					500: '#9A59BC',
					600: '#8745AB',
					700: '#763C95',
					800: '#62327C',
					900: '#4E2862',
					950: '#422254'
				},
				surface: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#71717a',
					600: '#52525b',
					700: '#3f3f46',
					800: '#27272a',
					900: '#18181b',
					950: '#161618'
				},
				tertiary: {
					50: '#FFF8F5',
					100: '#FFF5F0',
					200: '#FFEAE0',
					300: '#FFE0D1',
					400: '#FFD5C2',
					500: '#FFCAB1',
					600: '#FF8F5C',
					700: '#FF5405',
					800: '#AD3700',
					900: '#571B00',
					950: '#290D00'
				}
			}
		}
	},
	plugins: [
		forms,
		require('flowbite/plugin')({
			charts: true
		})
	]
};

export default config;

import forms from '@tailwindcss/forms';
``;
const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}',
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
					50: '#F8F0FE',
					100: '#EEDDFD',
					200: '#DCBBFC',
					300: '#CB99FA',
					400: '#BA77F9',
					500: '#A855F7',
					600: '#8815F4',
					700: '#6609BE',
					800: '#44067F',
					900: '#22033F',
					950: '#120222'
				},
				surface: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
					950: '#030712'
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
	plugins: [forms, require('flowbite/plugin')]
};

export default config;
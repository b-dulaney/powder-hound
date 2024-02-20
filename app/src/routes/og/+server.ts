import { read } from '$app/server';
import OpenSansBold from '$lib/OpenSans-Bold.ttf';
import OpenSansRegular from '$lib/OpenSans-Regular.ttf';
import OpenSansSemiBold from '$lib/OpenSans-SemiBold.ttf';
import SocialCard from '$lib/components/social-cards/social-card.svelte';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import type { RequestHandler } from './$types';
const openSansRegular = read(OpenSansRegular).arrayBuffer();
const openSansExtraBold = read(OpenSansBold).arrayBuffer();
const openSansSemiBold = read(OpenSansSemiBold).arrayBuffer();

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({ url }) => {
	const pageTitle = url.searchParams.get('title') ?? undefined;
	// @ts-ignore
	const result = SocialCard.render({ pageTitle });
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);
	const svg = await satori(element, {
		fonts: [
			{
				name: 'Open Sans',
				data: await openSansRegular,
				style: 'normal'
			},
			{
				name: 'Open Sans Bold',
				data: await openSansExtraBold,
				style: 'normal'
			},
			{
				name: 'Open Sans SemiBold',
				data: await openSansSemiBold,
				style: 'normal'
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import OpenSansRegular from '$lib/OpenSans-Regular.ttf';
import OpenSansBold from '$lib/OpenSans-Bold.ttf';
import OpenSansSemiBold from '$lib/OpenSans-SemiBold.ttf';
import { read } from '$app/server';
import type { RequestHandler } from './$types';
import { html as toReactNode } from 'satori-html';
import BackcountryReportSocialCard from '$lib/components/social-cards/backcountry-report-social-card.svelte';
import type { BackcountryOverview } from '$lib/supabase.types';
const openSansRegular = read(OpenSansRegular).arrayBuffer();
const openSansExtraBold = read(OpenSansBold).arrayBuffer();
const openSansSemiBold = read(OpenSansSemiBold).arrayBuffer();

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = locals;
	const slug = url.searchParams.get('slug') ?? undefined;
	const { data } = await supabase
		.from('backcountry_overview')
		.select('*')
		.eq('slug', slug!)
		.returns<BackcountryOverview[]>()
		.single();

	if (data) {
		const {
			display_name,
			snow_past_7d,
			snow_past_24h,
			snow_next_24h,
			snow_next_72h,
			overall_danger_level
		} = data;
		// @ts-ignore
		const result = BackcountryReportSocialCard.render({
			mountainName: display_name,
			snowLast7Days: snow_past_7d,
			snowLast24Hrs: snow_past_24h,
			snowNext24Hrs: snow_next_24h,
			snowNext72Hrs: snow_next_72h,
			avalancheDangerLevel: overall_danger_level
		});
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
	} else {
		return new Response('Not found', {
			status: 404
		});
	}
};

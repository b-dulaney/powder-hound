import satori from 'satori';
import {Resvg} from '@resvg/resvg-js';
import OpenSansRegular from '$lib/OpenSans-Regular.ttf';
import OpenSansBold from '$lib/OpenSans-Bold.ttf';
import OpenSansSemiBold from '$lib/OpenSans-SemiBold.ttf';
import { read } from '$app/server';
import type { RequestHandler } from './$types';
import {html as toReactNode } from 'satori-html'
import ResortReportSocialCard from '$lib/components/social-cards/resort-report-social-card.svelte';
import type { ResortOverview } from '$lib/supabase.types';
const openSansRegular = read(OpenSansRegular).arrayBuffer();
const openSansExtraBold = read(OpenSansBold).arrayBuffer();
const openSansSemiBold = read(OpenSansSemiBold).arrayBuffer();

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({url, locals}) => {
    const { supabase } = locals;
    const slug = url.searchParams.get('slug') ?? undefined;
    const { data } = await supabase
      .from('resort_overview')
      .select('*')
      .eq('slug', slug!)
      .returns<ResortOverview[]>()
      .single();

    if(data){
        const {display_name, snow_past_48h, snow_past_24h, snow_next_24h, snow_next_72h, base_depth, runs_open, total_runs} = data
        // @ts-ignore
        const result = ResortReportSocialCard.render({mountainName: display_name, snowLast48Hrs: snow_past_48h, snowLast24Hrs: snow_past_24h, snowNext24Hrs: snow_next_24h, snowNext72Hrs: snow_next_72h, baseDepth: base_depth, runsOpenPct: Math.floor((runs_open/total_runs)*100)});
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
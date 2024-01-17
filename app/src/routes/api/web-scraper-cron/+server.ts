import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database, ResortWebElements } from '$lib/supabase.types';
import { createClient } from '@supabase/supabase-js';
import { json, type RequestEvent } from '@sveltejs/kit';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { getTextContent } from '$lib/utils';
import type { ElementHandle } from 'puppeteer-core';
const supabase = createClient<Database>(PUBLIC_SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '');

async function fetchResortConditions(row: ResortWebElements) {
	const conditionsData = await scrapeConditions(row);
	return conditionsData;
}

async function scrapeConditions(webElements: ResortWebElements) {
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(
			'https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar'
		),
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	});
	let snowPastWeek: string | null;
	let snowTotal: string | null;
	let snowType: string | null = '';
	let liftsOpen: string | null;
	let runsOpen: string | null;

	if (webElements.trail_report_url) {
		const trailReportPage = await browser.newPage();
		trailReportPage.setDefaultNavigationTimeout(2 * 60 * 1000);
		await trailReportPage.goto(webElements.trail_report_url);

		const page = await browser.newPage();
		page.setDefaultNavigationTimeout(2 * 60 * 1000);
		await page.goto(webElements.conditions_url);

		const baseDepth = await getTextContent(page, webElements.base_depth_el);

		const snowPast24Hours = await getTextContent(page, webElements.snow_past_24h_el);

		const snowPast48Hours = await getTextContent(page, webElements.snow_past_48h_el);

		if (webElements.lifts_open_el) {
			liftsOpen = await getTextContent(trailReportPage, webElements.lifts_open_el);
		}

		if (webElements.runs_open_el) {
			runsOpen = await getTextContent(trailReportPage, webElements.runs_open_el);
		}

		if (webElements.snow_past_week_el) {
			snowPastWeek = await getTextContent(page, webElements.snow_past_week_el);
		}
		if (webElements.snow_total_el) {
			snowTotal = await getTextContent(page, webElements.snow_total_el);
		}
		if (webElements.snow_type_el) {
			snowType = await getTextContent(page, webElements.snow_type_el);
		}
		await browser.close();

		return {
			mountain_id: webElements.mountain_id,
			base_depth: parseInt(baseDepth!),
			lifts_open: parseInt(liftsOpen!) ?? null,
			runs_open: parseInt(runsOpen!) ?? null,
			snow_past_24h: parseInt(snowPast24Hours!),
			snow_past_48h: parseInt(snowPast48Hours!),
			snow_past_week: parseInt(snowPastWeek!) ?? null,
			snow_total: parseInt(snowTotal!) ?? null,
			snow_type: snowType,
			updated_at: new Date().toISOString()
		};
	} else {
		const page = await browser.newPage();
		page.setDefaultNavigationTimeout(2 * 60 * 1000);
		await page.goto(webElements.conditions_url);

		const baseDepth = await getTextContent(page, webElements.base_depth_el);

		// Eldora has a wonky layout for their conditions page that does not match other Alterra resorts. Must click a button to display the conditions popup.
		if (webElements.mountain_id === 6) {
			const buttonSelector =
				'div.styles__StyledFeedContainer-sc-1sc7djp-0:nth-child(3) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)';
			const conditionsButton = (await page.waitForSelector(
				buttonSelector
			)) as ElementHandle<HTMLElement>;
			await conditionsButton.evaluate((b) => b.click());
		}

		if (webElements.lifts_open_el) {
			liftsOpen = await getTextContent(page, webElements.lifts_open_el);

			if (liftsOpen?.includes('/')) {
				liftsOpen = liftsOpen.split('/')[0];
			}
			if (liftsOpen?.includes('of')) {
				liftsOpen = liftsOpen.split('of')[0];
				liftsOpen = liftsOpen.replace(/\D/g, '');
			}
		}

		if (webElements.runs_open_el) {
			runsOpen = await getTextContent(page, webElements.runs_open_el);
			if (runsOpen?.includes('/')) {
				runsOpen = runsOpen.split('/')[0];
			}
			if (runsOpen?.includes('of')) {
				runsOpen = runsOpen.split('of')[0];
				runsOpen = runsOpen.replace(/\D/g, '');
			}
		}

		const snowPast24Hours = await getTextContent(page, webElements.snow_past_24h_el);
		const snowPast48Hours = await getTextContent(page, webElements.snow_past_48h_el);

		if (webElements.snow_past_week_el) {
			snowPastWeek = await getTextContent(page, webElements.snow_past_week_el);
		}
		if (webElements.snow_total_el) {
			snowTotal = await getTextContent(page, webElements.snow_total_el);
		}
		if (webElements.snow_type_el) {
			snowType = await getTextContent(page, webElements.snow_type_el);
		}

		await browser.close();
		return {
			mountain_id: webElements.mountain_id,
			base_depth: parseInt(baseDepth!),
			lifts_open: parseInt(liftsOpen!) ?? null,
			runs_open: parseInt(runsOpen!) ?? null,
			snow_past_24h: parseInt(snowPast24Hours!),
			snow_past_48h: parseInt(snowPast48Hours!),
			snow_past_week: parseInt(snowPastWeek!) ?? null,
			snow_total: parseInt(snowTotal!) ?? null,
			snow_type: snowType,
			updated_at: new Date().toISOString()
		};
	}
}

export async function POST({ request }: RequestEvent) {
	const authorization = request.headers.get('Authorization');
	if (authorization !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const webElements: ResortWebElements = await request.json();
	const resortConditionsData = await fetchResortConditions(webElements);
	console.log(resortConditionsData);

	const { error } = await supabase
		.from('resort_conditions')
		.update(resortConditionsData)
		.eq('mountain_id', webElements.mountain_id);

	if (error) {
		console.error(`Error updating resort conditions`, error);
		return json({ error: error.message }, { status: 500 });
	} else {
		console.log(`Resort conditions updated`);
		return json({ message: 'Resort conditions updated' }, { status: 200 });
	}
}

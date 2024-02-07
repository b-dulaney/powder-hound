import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database, ResortConditions, ResortWebElements } from '$lib/supabase.types';
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

async function retryFetchResortConditions(
	webElements: ResortWebElements,
	retries: number
): Promise<Partial<ResortConditions> | null> {
	const result = await fetchResortConditions(webElements);
	if (result !== null) {
		return result;
	} else if (retries > 0) {
		console.log(`Retrying fetchResortConditions, ${retries} retries left...`);
		return retryFetchResortConditions(webElements, retries - 1);
	} else {
		throw new Error('Failed to fetch resort conditions after multiple attempts');
	}
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
	let snowPastWeek: string | null = '';
	let snowTotal: string | null = '';
	let snowType: string | null = '';
	let snowOvernight: string | null = '';
	let liftsOpen: string | null = '';
	let runsOpen: string | null = '';

	if (webElements.trail_report_url) {
		const trailReportPage = await browser.newPage();
		trailReportPage.setDefaultNavigationTimeout(2 * 60 * 1000);
		await trailReportPage.goto(webElements.trail_report_url);

		if (webElements.lifts_open_el) {
			liftsOpen = await getTextContent(trailReportPage, webElements.lifts_open_el);
		}

		if (webElements.runs_open_el) {
			runsOpen = await getTextContent(trailReportPage, webElements.runs_open_el);
		}
		if (webElements.snow_overnight_el) {
			snowOvernight = await getTextContent(trailReportPage, webElements.snow_overnight_el);
		}

		const page = await browser.newPage();
		page.setDefaultNavigationTimeout(2 * 60 * 1000);
		await page.goto(webElements.conditions_url);

		const baseDepth = await getTextContent(page, webElements.base_depth_el);

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

		if (!baseDepth || !liftsOpen || !runsOpen || !snowPast24Hours || !snowPast48Hours) {
			return null;
		}

		return {
			mountain_id: webElements.mountain_id,
			base_depth: parseInt(baseDepth),
			lifts_open: parseInt(liftsOpen),
			runs_open: parseInt(runsOpen),
			snow_overnight: snowOvernight ? parseInt(snowOvernight) : null,
			snow_past_24h: parseInt(snowPast24Hours),
			snow_past_48h: parseInt(snowPast48Hours),
			snow_past_week: snowPastWeek ? parseInt(snowPastWeek) : null,
			snow_total: snowTotal ? parseInt(snowTotal) : null,
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

		// PowderHorn does not show total runs or lifts, so we need to get creative here.
		if (webElements.mountain_id === 27) {
			await page.waitForSelector(
				'.bg-grey:nth-child(2), .bg-grey:nth-child(4), .bg-grey:nth-child(6), .bg-grey:nth-child(8), .bg-grey:nth-child(10)'
			);

			// Extract the number of open lifts based on the specified CSS selectors
			const openLiftsCount = await page.evaluate(() => {
				const selectors = [
					'.bg-grey:nth-child(2)',
					'.bg-grey:nth-child(4)',
					'.bg-grey:nth-child(6)',
					'.bg-grey:nth-child(8)',
					'.bg-grey:nth-child(10)'
				];

				// Check if each element contains the "fa-check-square-o" icon
				return selectors.reduce((count, selector) => {
					const element = document.querySelector(selector);
					if (element && element.querySelector('.fa-check-square-o')) {
						return count + 1;
					}
					return count;
				}, 0);
			});
			liftsOpen = openLiftsCount.toString();

			await page.waitForSelector('.groomers');

			// Extract the number of open runs based on the specified logic
			const openRunsCount = await page.evaluate(() => {
				const runElements = document.querySelectorAll('.groomers');

				// Check if each run element contains either "fa-check-square-o" or "fa-circle-o" icon
				return Array.from(runElements).reduce((count, runElement) => {
					const checkIcon = runElement.querySelector('.fa-check-square-o');
					const circleIcon = runElement.querySelector('.fa-circle-o');

					if (checkIcon || circleIcon) {
						return count + 1;
					}
					return count;
				}, 0);
			});
			runsOpen = openRunsCount.toString();
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
		if (webElements.snow_overnight_el) {
			snowOvernight = await getTextContent(page, webElements.snow_overnight_el);
		}
		if (webElements.snow_total_el) {
			snowTotal = await getTextContent(page, webElements.snow_total_el);
		}
		if (webElements.snow_type_el) {
			snowType = await getTextContent(page, webElements.snow_type_el);
		}

		await browser.close();

		if (!baseDepth || !liftsOpen || !runsOpen || !snowPast24Hours || !snowPast48Hours) {
			return null;
		}

		return {
			mountain_id: webElements.mountain_id,
			base_depth: parseInt(baseDepth),
			lifts_open: parseInt(liftsOpen),
			runs_open: parseInt(runsOpen),
			snow_overnight: snowOvernight ? parseInt(snowOvernight) : null,
			snow_past_24h: parseInt(snowPast24Hours),
			snow_past_48h: parseInt(snowPast48Hours),
			snow_past_week: snowPastWeek ? parseInt(snowPastWeek) : null,
			snow_total: snowTotal ? parseInt(snowTotal) : null,
			snow_type: snowType,
			updated_at: new Date().toISOString()
		};
	}
}

export async function POST({ request }: RequestEvent) {
	const retries = 3;
	const authorization = request.headers.get('Authorization');
	if (authorization !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const webElements: ResortWebElements = await request.json();
	const resortConditionsData = await fetchResortConditions(webElements);

	if (!resortConditionsData) {
		try {
			retryFetchResortConditions(webElements, retries);
		} catch (e) {
			console.error(`Error scraping resort conditions`, e);
			return json({ error: `Error scraping resort conditions` }, { status: 500 });
		}
	} else {
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
}

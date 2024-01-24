/* eslint-disable no-useless-escape */
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type {
	AvalancheDangerLevel,
	AvalancheForecast,
	AvalancheRating,
	Database
} from '$lib/supabase.types';
import { getInnerHTML, getTextContent } from '$lib/utils';
import chromium from '@sparticuz/chromium-min';
import { createClient } from '@supabase/supabase-js';
import { json, type RequestEvent } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import {
	ABOVE_TREE_LINE_DAY_ONE_SELECTOR,
	ABOVE_TREE_LINE_DAY_TWO_SELECTOR,
	AVALANCHE_SUMMARY_ONE_SELECTOR,
	AVALANCHE_SUMMARY_TWO_SELECTOR,
	BELOW_TREE_LINE_DAY_ONE_SELECTOR,
	BELOW_TREE_LINE_DAY_TWO_SELECTOR,
	DAY_ONE_SELECTOR,
	DAY_TWO_SELECTOR,
	ISSUE_DATE_SELECTOR,
	NEAR_TREE_LINE_DAY_ONE_SELECTOR,
	NEAR_TREE_LINE_DAY_TWO_SELECTOR
} from './constants';

interface MountainCoordinates {
	mountain_id: number;
	lat: number;
	lon: number;
}

async function getTreeLineData(page: Page, selector: string) {
	const treeLine = await getTextContent(page, selector);
	const treeLineLevel = treeLine ? parseInt(treeLine?.split('-')[0]) : 0;
	const treeLineRating = treeLine ? treeLine?.split('-')[1] : 'No Rating';

	return {
		level: treeLineLevel,
		rating: treeLineRating
	};
}

async function scrapeAvalancheForecast(mountain: MountainCoordinates): Promise<AvalancheForecast> {
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(
			'https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar'
		),
		headless: chromium.headless,
		ignoreHTTPSErrors: true
	});

	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(2 * 60 * 1000);
	const forecastUrl = `https://avalanche.state.co.us/?lat=${mountain.lat}&lng=${mountain.lon}`;
	await page.goto(forecastUrl);

	const avalancheSummaryOne = await getInnerHTML(page, AVALANCHE_SUMMARY_ONE_SELECTOR);
	const avalancheSummaryTwo = await getInnerHTML(page, AVALANCHE_SUMMARY_TWO_SELECTOR);
	const avalancheSummary = `${avalancheSummaryOne} ${avalancheSummaryTwo}`;
	const issueDate = await getTextContent(page, ISSUE_DATE_SELECTOR);

	const dayOne = (await getTextContent(page, DAY_ONE_SELECTOR)) ?? dayjs('dddd, MMM D');
	const dayTwo = (await getTextContent(page, DAY_TWO_SELECTOR)) ?? dayjs('dddd, MMM D');

	const aboveTreeLineDayOne = await getTreeLineData(page, ABOVE_TREE_LINE_DAY_ONE_SELECTOR);
	const aboveTreeLineDayTwo = await getTreeLineData(page, ABOVE_TREE_LINE_DAY_TWO_SELECTOR);

	const nearTreeLineDayOne = await getTreeLineData(page, NEAR_TREE_LINE_DAY_ONE_SELECTOR);
	const nearTreeLineDayTwo = await getTreeLineData(page, NEAR_TREE_LINE_DAY_TWO_SELECTOR);

	const belowTreeLineDayOne = await getTreeLineData(page, BELOW_TREE_LINE_DAY_ONE_SELECTOR);
	const belowTreeLineDayTwo = await getTreeLineData(page, BELOW_TREE_LINE_DAY_TWO_SELECTOR);

	const dangerDayOne: AvalancheDangerLevel = {
		date: dayOne,
		above_treeline: {
			level: aboveTreeLineDayOne.level as AvalancheRating['level'],
			rating: aboveTreeLineDayOne.rating as AvalancheRating['rating']
		},
		near_treeline: {
			level: nearTreeLineDayOne.level as AvalancheRating['level'],
			rating: nearTreeLineDayOne.rating as AvalancheRating['rating']
		},
		below_treeline: {
			level: belowTreeLineDayOne.level as AvalancheRating['level'],
			rating: belowTreeLineDayOne.rating as AvalancheRating['rating']
		}
	};

	const dangerDayTwo: AvalancheDangerLevel = {
		date: dayTwo,
		above_treeline: {
			level: aboveTreeLineDayTwo.level as AvalancheRating['level'],
			rating: aboveTreeLineDayTwo.rating as AvalancheRating['rating']
		},
		near_treeline: {
			level: nearTreeLineDayTwo.level as AvalancheRating['level'],
			rating: nearTreeLineDayTwo.rating as AvalancheRating['rating']
		},
		below_treeline: {
			level: belowTreeLineDayTwo.level as AvalancheRating['level'],
			rating: belowTreeLineDayTwo.rating as AvalancheRating['rating']
		}
	};

	await browser.close();

	const overallDangerLevel = Math.max(
		dangerDayOne.above_treeline.level,
		dangerDayOne.near_treeline.level,
		dangerDayOne.below_treeline.level,
		dangerDayTwo.above_treeline.level,
		dangerDayTwo.near_treeline.level,
		dangerDayTwo.below_treeline.level
	);

	return {
		mountain_id: mountain.mountain_id,
		avalanche_summary: avalancheSummary,
		issue_date: issueDate,
		overall_danger_level: overallDangerLevel,
		danger_levels: [dangerDayOne, dangerDayTwo],
		forecast_url: forecastUrl,
		updated_at: dayjs().toISOString()
	};
}

const supabase = createClient<Database>(PUBLIC_SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '');

export async function POST({ request }: RequestEvent) {
	const authorization = request.headers.get('Authorization');
	if (authorization !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const mountain: MountainCoordinates = await request.json();
	const avalancheForecast = await scrapeAvalancheForecast(mountain);

	const { error } = await supabase
		.from('avalanche_forecasts')
		.update(avalancheForecast)
		.eq('mountain_id', mountain.mountain_id);

	if (error) {
		console.error(`Error updating avalanche forecast`, error);
		return json({ error: error.message }, { status: 500 });
	} else {
		console.log(`Avalanche forecast updated`);
		return json({ message: 'Avalanche forecast updated' }, { status: 200 });
	}
}

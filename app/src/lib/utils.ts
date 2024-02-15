import dayjs from 'dayjs';
import type { Page } from 'puppeteer-core';

export function convertWindDirection(input: string): string {
	const degreeStr = input.split('/')[0];
	const degree = parseInt(degreeStr, 10);

	let cardinalDirection: string;

	if ((degree >= 0 && degree <= 22.5) || (degree > 337.5 && degree <= 360)) {
		cardinalDirection = 'N';
	} else if (degree > 22.5 && degree <= 67.5) {
		cardinalDirection = 'NE';
	} else if (degree > 67.5 && degree <= 112.5) {
		cardinalDirection = 'E';
	} else if (degree > 112.5 && degree <= 157.5) {
		cardinalDirection = 'SE';
	} else if (degree > 157.5 && degree <= 202.5) {
		cardinalDirection = 'S';
	} else if (degree > 202.5 && degree <= 247.5) {
		cardinalDirection = 'SW';
	} else if (degree > 247.5 && degree <= 292.5) {
		cardinalDirection = 'W';
	} else if (degree > 292.5 && degree <= 337.5) {
		cardinalDirection = 'NW';
	} else {
		throw new Error('Invalid degree value');
	}

	return cardinalDirection;
}

export function convertWindSpeed(input: string): string {
	const speedStr = input.split('/')[1];
	const speed = parseInt(speedStr, 10);
	return `${speed} MPH`;
}

export const formatSnowfall = (snowfall: number) => {
	if (snowfall > 1) {
		return Math.round(snowfall).toString();
	}
	return snowfall < 1 && snowfall > 0 ? '<1' : snowfall.toString();
};

export const weatherConditionsMap: Record<string, string> = {
	isocloud: 'Isolated Clouds',
	clear: 'Clear',
	snow: 'Snow',
	ptlycldy: 'Partly Cloudy',
	mslycldy: 'Mostly Cloudy',
	cloudy: 'Cloudy',
	fog: 'Fog',
	haze: 'Haze'
};

export const formatDate = (date: string) => {
	if (date === 'Today') {
		return date;
	}
	if (dayjs(date).isSame(dayjs(), 'day')) {
		return 'Today';
	}

	return dayjs(date).format('ddd DD');
};

export async function getTextContent(page: Page, selector: string): Promise<string | null> {
	try {
		const el = await page.waitForSelector(selector);
		return el?.evaluate((el) => el.textContent) ?? null;
	} catch (error) {
		return null;
	}
}

export async function getInnerHTML(page: Page, selector: string): Promise<string | null> {
	try {
		const el = await page.waitForSelector(selector);
		return el?.evaluate((el) => el.innerHTML) ?? null;
	} catch (error) {
		return null;
	}
}

export const avalancheDangerRatingsMap: Record<number, string> = {
	0: 'No Rating',
	1: 'Low',
	2: 'Moderate',
	3: 'Considerable',
	4: 'High',
	5: 'Extreme'
};

export function formatHeroNumber(num: number, digits: number) {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'K' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' }
	];
	const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
	const item = lookup.findLast((item) => num >= item.value);
	return item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0';
}

export function observeElement(id: string): Promise<boolean> {
	console.log(id);
	return new Promise((resolve) => {
		const observer = new IntersectionObserver((entries) => {
			const targetEntry = entries.find((entry) => entry.target.id === id);
			if (targetEntry?.isIntersecting) {
				resolve(true);
				observer.disconnect();
			}
		});

		const element = document.getElementById(id);
		if (element) {
			observer.observe(element);
		}

		// cleanup function
		return () => {
			observer.disconnect();
			resolve(false);
		};
	});
}

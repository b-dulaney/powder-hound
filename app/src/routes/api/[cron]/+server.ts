import { CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const authHeader = event.request.headers.get('Authorization');
	if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const cron = event.request.url.split('/')[3];
	console.log(cron);
	if (!cron) return json({ error: 'Invalid cron' }, { status: 400 });
	const { statusText, status } = await startScraper(cron);
	return json({ statusText }, { status });
};

async function startScraper(cron: string) {
	const response = await fetch('http://64.23.239.68:80', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
		},
		body: JSON.stringify({ mountainName: cron })
	});
	return response;
}

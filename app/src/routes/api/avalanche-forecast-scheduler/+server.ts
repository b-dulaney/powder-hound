import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase.types';
import { createClient } from '@supabase/supabase-js';
import { json, type RequestEvent } from '@sveltejs/kit';

const supabase = createClient<Database>(PUBLIC_SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '');

interface MountainCoordinates {
	mountain_id: number;
	lat: number;
	lon: number;
}

export async function GET({ request, url }: RequestEvent) {
	// Verify this request is from Vercel Cron
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Fetch all backcountry mountains from the database
		const { data: mountains, error: fetchError } = await supabase
			.from('mountains')
			.select('mountain_id, lat, lon')
			.eq('location_type', 'backcountry');

		if (fetchError) {
			console.error('Error fetching backcountry mountains:', fetchError);
			return json(
				{ error: 'Failed to fetch mountains', details: fetchError.message },
				{ status: 500 }
			);
		}

		if (!mountains || mountains.length === 0) {
			console.log('No backcountry mountains found');
			return json({ message: 'No backcountry mountains found' }, { status: 200 });
		}

		console.log(`Found ${mountains.length} backcountry mountains to process`);

		// Process each mountain by calling the avalanche forecast cron API
		const results = await Promise.allSettled(
			mountains.map(async (mountain: MountainCoordinates) => {
				const apiUrl = `${url.origin}/api/avalanche-forecast-cron`;

				console.log(`Processing mountain ${mountain.mountain_id}`);

				const response = await fetch(apiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
					},
					body: JSON.stringify(mountain)
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(`Failed to update mountain ${mountain.mountain_id}: ${errorData.error}`);
				}

				return { mountain_id: mountain.mountain_id, success: true };
			})
		);

		// Summarize results
		const successful = results.filter((r) => r.status === 'fulfilled').length;
		const failed = results.filter((r) => r.status === 'rejected').length;

		console.log(`Avalanche forecast cron completed: ${successful} successful, ${failed} failed`);

		return json(
			{
				message: 'Avalanche forecast cron completed',
				total: mountains.length,
				successful,
				failed,
				errors: results
					.filter((r) => r.status === 'rejected')
					.map((r) => (r as PromiseRejectedResult).reason.message)
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Unexpected error in avalanche forecast scheduler:', error);
		return json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}

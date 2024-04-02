import type { WebScraperOverview } from '$lib/supabase.types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	const { data, error } = await supabase
		.from('web_scraper_overview')
		.select()
		.returns<WebScraperOverview[]>()
		.single();

	if (error) {
		throw error;
	}

	return {
		scrapingOverview: data
	};
};

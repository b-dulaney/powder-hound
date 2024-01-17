import { supabase } from '$lib/supabaseClient.js';
import type { ResortDetail } from '$lib/supabase.types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { data } = await supabase
		.from('resort_detail')
		.select()
		.eq('slug', params.slug)
		.returns<ResortDetail[]>()
		.single();

	if (data) {
		return {
			resortDetails: data
		};
	}

	error(404, 'Location not found');
};

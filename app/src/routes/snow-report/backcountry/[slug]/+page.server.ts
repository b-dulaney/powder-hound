import { supabase } from '$lib/supabaseClient.js';
import type { BackcountryDetail } from '$lib/supabase.types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { data } = await supabase
		.from('backcountry_detail')
		.select()
		.eq('slug', params.slug)
		.returns<BackcountryDetail[]>()
		.single();

	if (data) {
		return {
			backcountryDetails: data
		};
	}

	error(404, 'Location not found');
};

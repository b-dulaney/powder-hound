import { supabase } from '$lib/supabaseClient.js';
import type { MountainDetail, ResortConditions } from '$lib/supabase.types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

function countNonNullProperties(resortConditions: ResortConditions): number {
	const properties: Partial<keyof ResortConditions>[] = [
		'base_depth',
		'snow_past_24h',
		'snow_past_48h',
		'snow_past_week',
		'snow_total'
	];
	let count = 0;
	for (const prop of properties) {
		if (resortConditions[prop] !== null) {
			count++;
		}
	}
	return count;
}

export const load: PageServerLoad = async ({ params }) => {
	const { data } = await supabase
		.from('mountain_detail')
		.select()
		.eq('slug', params.slug)
		.returns<MountainDetail[]>()
		.single();

	if (data) {
		if (data.location_type === 'resort') {
			const { data: resortConditions } = await supabase
				.from('resort_conditions')
				.select()
				.eq('mountain_id', data.mountain_id)
				.returns<ResortConditions[]>()
				.single();
			const gridCols = countNonNullProperties(resortConditions!);
			return {
				mountainDetails: data,
				resortConditions: resortConditions,
				gridCols: gridCols
			};
		}
		return {
			mountainDetails: data
		};
	}

	error(404, 'Location not found');
};

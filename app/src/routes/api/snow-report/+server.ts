import { json, type RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const { supabase } = event.locals;
	const params = event.url.searchParams;

	const q = params.get('q');
	const sort = params.get('sort');
	const order = params.get('order');
	const view = params.get('view') as 'backcountry_overview' | 'resort_overview';
	const closed = params.get('closed');

	const direction = order === 'asc';

	let query = supabase.from(view).select();
	if (q) {
		query = query.ilike('display_name', `%${q}%`);
	}

	if (sort) {
		query = query.order(sort, { ascending: direction });
	}

	if (closed) {
		query = query.eq('closed', closed);
	}

	const { data, error } = await query;

	return json({ data, error });
};

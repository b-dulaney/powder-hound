import { json, type RequestEvent } from '@sveltejs/kit';

// The only views this endpoint serves; anything else would let the query string pick any table.
const VIEWS = ['backcountry_overview', 'resort_overview'] as const;
type View = (typeof VIEWS)[number];

export const GET = async (event: RequestEvent) => {
	const { supabase } = event.locals;
	const params = event.url.searchParams;

	const q = params.get('q');
	const sort = params.get('sort');
	const order = params.get('order');
	const view = params.get('view');
	const closed = params.get('closed');

	if (!VIEWS.includes(view as View)) {
		return json({ data: null, error: { message: 'Unknown view' } }, { status: 400 });
	}

	const direction = order === 'asc';

	let query = supabase.from(view as View).select();
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

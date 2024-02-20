import { formatHeroNumber } from '$lib/utils.js';

export async function load(event) {
	const { supabase } = event.locals;

	const { count } = await supabase
		.from('caic_data')
		.select('*', { count: 'estimated', head: true });

	if (!count) {
		return {
			session: await event.locals.getSession(),
			caicDataCount: '50K+'
		};
	}
	return {
		session: await event.locals.getSession(),
		caicDataCount: formatHeroNumber(count, 0)
	};
}

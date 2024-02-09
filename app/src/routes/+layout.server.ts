import type { LayoutServerLoad } from './$types';

export const prerender = 'auto';

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	return {
		session: await getSession()
	};
};

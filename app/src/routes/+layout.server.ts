import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, cookies }) => {
	const session = await getSession();

	if (session == null) {
		const allCookies = cookies.getAll();
		allCookies.forEach((cookie) => {
			if (cookie.name.startsWith('sb-')) {
				cookies.delete(cookie.name, { path: '/' });
			}
		});
	}

	return {
		session
	};
};

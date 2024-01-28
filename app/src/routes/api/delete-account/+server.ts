import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const POST = async (event: RequestEvent) => {
	const { supabase } = event.locals;
	const data = await event.request.json();
	const { userId } = data as { userId: string };

	const { error } = await supabase.auth.admin.deleteUser(userId);

	if (error) {
		return new Response(
			JSON.stringify({
				success: false,
				body: error.message
			})
		);
	}

	redirect(301, '/auth/logout');
};

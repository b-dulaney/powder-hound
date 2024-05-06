import type { RequestEvent } from './$types';
import { handleInvalidAuthToken } from '$lib/utils';

export const POST = async (event: RequestEvent) => {
	const { supabase } = event.locals;
	const data = await event.request.json();
	const { userId } = data as { userId: string };

	const { error } = await supabase.auth.admin.deleteUser(userId);
	if (error) {
		console.error('/api/delete-account', error);
		return new Response(
			JSON.stringify({
				success: false,
				body: error.message
			})
		);
	}

	handleInvalidAuthToken(event);

	return new Response(JSON.stringify({ success: true }));
};

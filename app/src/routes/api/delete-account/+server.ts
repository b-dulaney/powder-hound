import type { RequestEvent } from './$types';
import { handleInvalidAuthToken } from '$lib/utils';
import { supabaseAdmin } from '$lib/server/supabase-admin';

export const POST = async (event: RequestEvent) => {
	// Only the signed-in user can delete their own account; any userId in the body is ignored.
	const user = await event.locals.getUser();
	if (!user) {
		return new Response(JSON.stringify({ success: false, body: 'Unauthorized' }), { status: 401 });
	}

	const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
	if (error) {
		console.error('/api/delete-account', error);
		return new Response(JSON.stringify({ success: false, body: error.message }), { status: 500 });
	}

	await handleInvalidAuthToken(event);

	return new Response(JSON.stringify({ success: true }));
};

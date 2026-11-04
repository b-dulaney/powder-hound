import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
	const { supabase, getUser } = event.locals;

	// Only the signed-in user's own alerts; any userId in the body is ignored.
	const user = await getUser();
	if (!user) {
		return new Response(JSON.stringify({ success: false, body: 'Unauthorized' }), { status: 401 });
	}

	const { error } = await supabase.from('user_alerts').delete().eq('user_id', user.id).select();
	if (error) {
		return new Response(JSON.stringify({ success: false, body: error.message }), { status: 500 });
	}

	return new Response(JSON.stringify({ success: true }));
};

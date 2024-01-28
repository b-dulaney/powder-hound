import type { RequestEvent } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
	const { supabase } = event.locals;
	const data = await event.request.json();
	const { userId } = data as { userId: string };

	const { error } = await supabase.from('user_alerts').delete().eq('user_id', userId).select();
	if (error) {
		return new Response(
			JSON.stringify({
				success: false,
				body: error.message
			})
		);
	}

	return new Response(
		JSON.stringify({
			success: true
		})
	);
};

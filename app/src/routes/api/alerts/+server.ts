import type { RequestEvent } from './$types';
import type { UserAlerts } from '$lib/supabase.types';

export const POST = async (event: RequestEvent) => {
	const { supabase, getSession } = event.locals;
	const session = await getSession();

	if (!session) {
		return new Response(
			JSON.stringify({
				status: 401,
				success: false,
				body: 'Unauthorized'
			})
		);
	}
	const data = (await event.request.json()) as UserAlerts;
	const { user_id, mountain_id, display_name, email, threshold_inches, paused } = data;

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.insert({
			user_id,
			mountain_id,
			display_name,
			email,
			threshold_inches,
			paused
		})
		.returns<UserAlerts[]>()
		.select();

	if (error) {
		return new Response(
			JSON.stringify({
				status: 500,
				success: false,
				body: error.message
			})
		);
	}

	return new Response(JSON.stringify({ status: 200, success: true, body: userAlerts }));
};

export const PUT = async (event: RequestEvent) => {
	const { supabase, getSession } = event.locals;
	const session = getSession();

	if (!session) {
		return new Response(
			JSON.stringify({
				status: 401,
				success: false,
				body: 'Unauthorized'
			})
		);
	}

	const data = (await event.request.json()) as UserAlerts[];

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.upsert(data)
		.returns<UserAlerts[]>()
		.select();

	if (error) {
		return new Response(
			JSON.stringify({
				status: 500,
				success: false,
				body: error.message
			})
		);
	}

	return new Response(JSON.stringify({ status: 200, success: true, body: userAlerts }));
};

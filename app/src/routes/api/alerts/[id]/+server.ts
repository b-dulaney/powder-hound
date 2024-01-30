import type { RequestEvent } from './$types';
import type { UserAlerts } from '$lib/supabase.types';

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

	const data = (await event.request.json()) as UserAlerts;
	const { id, threshold_inches, paused } = data;

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.update({ threshold_inches: threshold_inches, paused: paused })
		.eq('id', id)
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

export const DELETE = async (event: RequestEvent) => {
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

	const alertId = event.params.id;

	const { data, error } = await supabase
		.from('user_alerts')
		.delete()
		.eq('id', alertId)
		.returns<UserAlerts[]>()
		.select()
		.single();

	if (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				status: 500,
				success: false,
				body: error.message
			})
		);
	}

	return new Response(JSON.stringify({ status: 200, success: true, body: data }));
};

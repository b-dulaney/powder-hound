import type { RequestEvent } from './$types';
import type { UserAlerts } from '$lib/supabase.types';

const unauthorized = () =>
	new Response(JSON.stringify({ status: 401, success: false, body: 'Unauthorized' }), {
		status: 401
	});

const serverError = (message: string) =>
	new Response(JSON.stringify({ status: 500, success: false, body: message }), { status: 500 });

export const POST = async (event: RequestEvent) => {
	const { supabase, getUser } = event.locals;
	const user = await getUser();
	if (!user) return unauthorized();

	const data = (await event.request.json()) as UserAlerts;
	const { mountain_id, display_name, threshold_inches, paused } = data;

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.insert({
			// Owner and delivery address come from the verified user, never the request body.
			user_id: user.id,
			email: user.email ?? data.email,
			mountain_id,
			display_name,
			threshold_inches,
			paused
		})
		.returns<UserAlerts[]>()
		.select();

	if (error) return serverError(error.message);

	return new Response(JSON.stringify({ status: 200, success: true, body: userAlerts }));
};

export const PUT = async (event: RequestEvent) => {
	const { supabase, getUser } = event.locals;
	const user = await getUser();
	if (!user) return unauthorized();

	const data = (await event.request.json()) as UserAlerts[];
	// Pin every row to the caller so an upsert can't create or take over another user's alerts.
	const rows = data.map((alert) => ({ ...alert, user_id: user.id }));

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.upsert(rows)
		.returns<UserAlerts[]>()
		.select();

	if (error) return serverError(error.message);

	return new Response(JSON.stringify({ status: 200, success: true, body: userAlerts }));
};

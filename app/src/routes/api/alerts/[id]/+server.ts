import type { RequestEvent } from './$types';
import type { UserAlerts } from '$lib/supabase.types';

const unauthorized = () =>
	new Response(JSON.stringify({ status: 401, success: false, body: 'Unauthorized' }), {
		status: 401
	});

const serverError = (message: string) =>
	new Response(JSON.stringify({ status: 500, success: false, body: message }), { status: 500 });

export const PUT = async (event: RequestEvent) => {
	const { supabase, getUser } = event.locals;
	const user = await getUser();
	if (!user) return unauthorized();

	const data = (await event.request.json()) as UserAlerts;
	const { threshold_inches, paused } = data;

	const { data: userAlerts, error } = await supabase
		.from('user_alerts')
		.update({
			threshold_inches: threshold_inches,
			paused: paused,
			updated_at: new Date().toISOString()
		})
		.eq('id', Number(event.params.id))
		.eq('user_id', user.id)
		.returns<UserAlerts[]>()
		.select();

	if (error) return serverError(error.message);

	return new Response(JSON.stringify({ status: 200, success: true, body: userAlerts }));
};

export const DELETE = async (event: RequestEvent) => {
	const { supabase, getUser } = event.locals;
	const user = await getUser();
	if (!user) return unauthorized();

	const { data, error } = await supabase
		.from('user_alerts')
		.delete()
		.eq('id', Number(event.params.id))
		.eq('user_id', user.id)
		.returns<UserAlerts[]>()
		.select()
		.single();

	if (error) {
		console.error(error);
		return serverError(error.message);
	}

	return new Response(JSON.stringify({ status: 200, success: true, body: data }));
};

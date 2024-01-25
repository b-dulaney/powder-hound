import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { supabase } = event.locals;
	const session = await event.locals.getSession();
	if (!session) {
		return redirect(301, '/login');
	}

	await supabase.auth.setSession({
		access_token: session.access_token,
		refresh_token: session.refresh_token
	});

	const { data: profileData, error: profileError } = await supabase
		.from('profile')
		.select()
		.maybeSingle();

	const { data: mountainData, error: mountainError } = await supabase
		.from('mountains')
		.select('mountain_id, display_name')
		.order('display_name', { ascending: true });

	if (!profileData && !profileError) {
		return {
			userExists: false,
			userId: session.user.id,
			email: session.user.email,
			mountainData
		};
	}

	if (profileData) {
		redirect(301, '/alerts');
	}

	if (profileError || mountainError) {
		error(500);
	}
};

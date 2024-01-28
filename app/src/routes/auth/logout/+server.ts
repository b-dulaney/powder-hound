import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		locals: { supabase }
	} = event;

	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error(error);
	}
	redirect(301, '/login');
};

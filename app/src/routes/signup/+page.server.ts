import { PUBLIC_SITE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { building } from '$app/environment';
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';

let redis: Redis;
let ratelimit: Ratelimit;

if (!building) {
	redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.fixedWindow(2, '60 s')
	});
}

export const actions = {
	login: async (event) => {
		const ip = event.getClientAddress();
		const rateLimitAttempt = await ratelimit.limit(ip);
		if (!rateLimitAttempt.success) {
			const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
			return fail(429, {
				error: `Too many requests. Please try again in ${timeRemaining} seconds.`,
				tooManyRequests: true,
				timeRemaining
			});
		}

		const { supabase } = event.locals;
		const data = await event.request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${PUBLIC_SITE_URL}/auth/callback`
			}
		});

		if (error) {
			return {
				success: false,
				body: error.message
			};
		}

		return { success: true, email };
	},
	verifyOtp: async (event) => {
		const { supabase } = event.locals;
		const data = await event.request.formData();
		const email = data.get('email') as string;
		const otp = data.get('otp') as string;

		const { error } = await supabase.auth.verifyOtp({
			email,
			token: otp,
			type: 'email'
		});

		if (error?.status === 401) {
			return fail(401, { otp, email, error: 'Invalid OTP' });
		} else if (error) {
			return fail(500, { otp, email, error: error.message });
		}

		redirect(301, '/auth/callback?otp=true');
	}
};

export const load = async (event) => {
	const session = await event.locals.getSession();

	if (session) {
		redirect(301, '/snow-report/resorts');
	}
};

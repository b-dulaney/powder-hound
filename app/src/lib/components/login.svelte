<script lang="ts">
	import GithubIcon from '$lib/components/github-icon.svelte';
	import GoogleIcon from '$lib/components/google-icon.svelte';
	import { PUBLIC_SITE_URL, PUBLIC_VERCEL_ENV } from '$env/static/public';
	import type { SupabaseClient } from '@supabase/supabase-js';
	let isResendDisabled = false;
	let email = '';
	let emailSent = false;

	export let supabase: SupabaseClient;
    export let action: 'login' | 'signup' = 'login';
    const actionText = action === 'login' ? 'Sign in' : 'Sign up';

	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${PUBLIC_SITE_URL}/auth/callback`,
			}
			
		});
	}

	async function signInWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${PUBLIC_SITE_URL}/auth/callback`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	}

	async function signInWithEmail() {
		emailSent = true;
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${PUBLIC_SITE_URL}/auth/callback`,
			}
		});

		if (error) {
			console.error(error);
		}
	}

	async function resendEmail() {
		isResendDisabled = true;
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: '/auth/callback'
			}
		});

		if (error) {
			console.error(error);
		}

		setTimeout(() => {
			isResendDisabled = false;
		}, 30000);
	}
</script>

	{#if !emailSent}
		<div class="card max-w-sm p-4">
			<div class="card-header text-center">
				<p class="text-xl font-semibold">{actionText} with</p>
			</div>
			<div class="mb-4 flex flex-col gap-2 p-4">
				{#if PUBLIC_VERCEL_ENV !== 'production'}
					<button
						class="btn btn-lg rounded-md bg-red-500 text-white"
						title="Sign in with Google"
						on:click={signInWithGoogle}
					>
						<span><GoogleIcon /></span>
						<span>Google</span>
					</button>
				{/if}
				<!-- <button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Microsoft</button>
				<button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Facebook</button> -->
				<button
					class="btn btn-lg rounded-md bg-neutral-900 text-white"
					title="Sign in with Github"
					on:click={signInWithGithub}
				>
					<span><GithubIcon /></span>
					<span>Github</span>
				</button>
				<div class="flex items-center justify-center p-2">
					<hr class="w-1/4 px-4" />
					<span class="px-4">Or</span>
					<hr class="w-1/4 px-4" />
				</div>
				<p class="mb-2 text-center text-xl font-semibold">Continue with email</p>
				<div>
					<input
						class="input mb-3 !rounded-md"
						type="email"
						autocomplete="email"
						bind:value={email}
						placeholder="Email"
					/>
					<button
						class="variant-filled-primary btn btn-lg w-full rounded-md"
						on:click={signInWithEmail}>{actionText}</button
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="card max-w-sm p-4">
			<div class="card-header text-center">
				<p class="text-center text-3xl font-semibold">Check your email</p>
			</div>
			<div class="mb-4 flex flex-col items-center justify-between gap-4 p-4">
				<p class="text-center text-xl">
					We've sent a magic link to <span class="font-semibold text-primary-400">{email}</span>.
					Follow the link in the email to sign in to your account.
				</p>
				<div class="mt-4 flex w-full items-center justify-center p-2">
					<hr class="flex-auto px-4" />
					<span class="px-2">Didn't receive an email?</span>
					<hr class="flex-auto px-4" />
				</div>
				<button
					class="variant-filled-primary btn btn-lg rounded-md"
					on:click={resendEmail}
					disabled={isResendDisabled}>Resend email</button
				>
				<a class="anchor mt-2 !text-surface-400" href="/login" data-sveltekit-reload
					>{actionText} with another method</a
				>
			</div>
		</div>
	{/if}

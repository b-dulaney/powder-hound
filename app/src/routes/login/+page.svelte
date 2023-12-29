<script lang="ts">
	import GithubIcon from '$lib/components/github-icon.svelte';
	import GoogleIcon from '$lib/components/google-icon.svelte';
	import type { PageData } from '../$types';
	let isResendDisabled = false;
	let email = '';
	let emailSent = false;

	export let data: PageData;
	const { supabase } = data;

	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: '/auth/callback'
			}
		});
	}

	async function signInWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: '/auth/callback',
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
				emailRedirectTo: '/auth/callback'
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

<div class="flex items-start mt-10 md:mt-20 md:mb-40 justify-center h-full px-4">
	{#if !emailSent}
		<div class="card p-4 max-w-sm">
			<div class="card-header text-center">
				<p class="text-xl font-semibold">Sign in with</p>
			</div>
			<div class="mb-4 p-4 flex flex-col gap-2">
				<button
					class="btn btn-lg bg-red-500 rounded-md"
					title="Sign in with Google"
					on:click={signInWithGoogle}
				>
					<span><GoogleIcon /></span>
					<span>Google</span>
				</button>
				<!-- <button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Microsoft</button>
			<button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Facebook</button> -->
				<button
					class="btn btn-lg bg-neutral-900 rounded-md"
					title="Sign in with Github"
					on:click={signInWithGithub}
				>
					<span><GithubIcon /></span>
					<span>Github</span>
				</button>
				<div class="flex justify-center items-center p-2">
					<hr class="w-1/4 px-4" />
					<span class="px-4">Or</span>
					<hr class="w-1/4 px-4" />
				</div>
				<p class="text-xl font-semibold text-center mb-2">Continue with email</p>
				<div>
					<input
						class="input mb-3 !rounded-md"
						type="email"
						autocomplete="email"
						bind:value={email}
						placeholder="Email"
					/>
					<button
						class="btn w-full btn-lg variant-filled-tertiary rounded-md"
						on:click={signInWithEmail}>Sign In</button
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="card p-4 max-w-sm">
			<div class="card-header text-center">
				<p class="text-3xl font-semibold text-center">Check your email</p>
			</div>
			<div class="flex flex-col justify-between items-center gap-4 mb-4 p-4">
				<p class="text-center text-xl">
					We've sent a magic link to <span class="font-semibold text-primary-400">{email}</span>.
					Follow the link in the email to sign in to your account.
				</p>
				<div class="flex justify-center items-center p-2 w-full mt-4">
					<hr class="flex-auto px-4" />
					<span class="px-4">Didn't receive an email?</span>
					<hr class="flex-auto px-4" />
				</div>
				<button
					class="btn btn-lg variant-filled-tertiary rounded-md"
					on:click={resendEmail}
					disabled={isResendDisabled}>Resend email</button
				>
				<a class="anchor !text-surface-400 mt-2" href="/login" data-sveltekit-reload
					>Sign in with another method</a
				>
			</div>
		</div>
	{/if}
</div>

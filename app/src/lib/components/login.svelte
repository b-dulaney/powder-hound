<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_SITE_URL, PUBLIC_VERCEL_ENV } from '$env/static/public';
	import GithubIcon from '$lib/components/github-icon.svelte';
	import GoogleIcon from '$lib/components/google-icon.svelte';
	import { tooManyRequestsTimer } from '$lib/utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { ActionData } from '../../routes/login/$types';

	export let form: ActionData;
	let formLoading = false;

	export let supabase: SupabaseClient;
	export let action: 'login' | 'signup' = 'login';
	const actionText = action === 'login' ? 'Sign in' : 'Sign up';

	let timer;
	$: if (form?.tooManyRequests) {
		timer = tooManyRequestsTimer(form?.timeRemaining);
	}

	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${PUBLIC_SITE_URL}/auth/callback`
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
</script>

{#if !form?.success}
	<div class="card max-w-sm p-4">
		<div class="card-header text-center">
			<p class="text-xl font-semibold">{actionText} with</p>
		</div>
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				formLoading = true;
				return async ({ update }) => {
					formLoading = false;
					update();
				};
			}}
		>
			<div class="mb-4 flex flex-col gap-2 p-4">
				{#if PUBLIC_VERCEL_ENV !== 'production'}
					<button
						type="button"
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
					type="button"
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
					<label class="label mb-4">
						<span>Email</span>
						<input
							class="input !rounded-md"
							type="email"
							name="email"
							required
							autocomplete="email"
							placeholder="Email"
						/>
					</label>
					{#if form?.missing}<p class="pb-4 pt-2">
							<span class="px-2 text-primary-500">*</span>The email field is required
						</p>{/if}
					{#if formLoading}
						<button
							type="submit"
							class="variant-filled-primary btn btn-lg w-full rounded-md"
							disabled
							formAction="?/login"
						>
							<ProgressRadial value={undefined} width="w-8" />
						</button>
					{:else if form?.tooManyRequests && $timer && $timer > 0}
						<button
							type="submit"
							class="variant-filled-primary btn btn-lg w-full rounded-md"
							disabled
						>
							Please wait {$timer} seconds
						</button>
					{:else}
						<button
							type="submit"
							class="variant-filled-primary btn btn-lg w-full rounded-md"
							formAction="?/login"
						>
							{actionText}
						</button>
					{/if}
				</div>
			</div>
		</form>
		<p class="p-4 text-center text-sm">
			By registering you agree to PowderHound's <a class="anchor" href="/terms-of-use"
				>Terms of Use</a
			>
			and acknowledge that you've read our
			<a class="anchor" href="/privacy-policy">Privacy Policy</a>.
		</p>
	</div>
{:else if form?.success}
	<div class="card mx-4 mt-20 p-2 md:p-4">
		<div class="card-header text-center">
			<p class="text-center text-3xl font-semibold">Check your email</p>
		</div>
		<div class="mb-4 flex max-w-sm flex-col items-center justify-between gap-4 p-4 md:max-w-lg">
			<p class="text-center text-xl">
				We've sent a magic link to <span class="font-semibold text-primary-400">{form?.email}</span
				>. Follow the link in the email to sign in to your account.
			</p>
			<!-- <div class="mt-4 flex w-full items-center justify-center p-2">
					<hr class="flex-auto px-4" />
					<span class="px-2">Didn't receive an email?</span>
					<hr class="flex-auto px-4" />
				</div>
				<button
					class="variant-filled-primary btn btn-lg rounded-md"
					on:click={resendEmail}
					disabled={isResendDisabled}>Resend email</button
				>
				<button class="anchor mt-2 !text-surface-400" on:click={() => {emailSent = false; email = '';}}
					>{actionText} with another method</button> -->
		</div>
	</div>
{/if}

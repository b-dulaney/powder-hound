<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_SITE_URL, PUBLIC_VERCEL_ENV } from '$env/static/public';
	import GithubIcon from '$lib/components/github-icon.svelte';
	import GoogleIcon from '$lib/components/google-icon.svelte';
	import { tooManyRequestsTimer } from '$lib/utils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { ActionData } from '../../routes/login/$types';
	import { goto } from '$app/navigation';

	export let form: ActionData;
	export let redirectUrl: string | null;
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
				redirectTo: redirectUrl
					? `${PUBLIC_SITE_URL}/auth/callback?redirect=${redirectUrl}`
					: `${PUBLIC_SITE_URL}/auth/callback`
			}
		});
	}

	async function signInWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectUrl
					? `${PUBLIC_SITE_URL}/auth/callback?redirect=${redirectUrl}`
					: `${PUBLIC_SITE_URL}/auth/callback`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	}
</script>

<div class="flex flex-col gap-8">
	{#if !form?.success && !form?.error}
		<div class="card max-w-sm p-4">
			<div class="card-header text-center">
				<p class="text-xl font-semibold">{actionText} with</p>
			</div>
			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					formLoading = true;
					return async ({ update, result }) => {
						if (result.type === 'redirect') {
							goto(result.location);
						}
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
	{:else}
		<div class="card max-w-sm p-4">
			<div class="card-header text-center">
				<p class="text-center text-2xl font-semibold">Check your email</p>
			</div>
			<div class="mb-4 flex max-w-sm flex-col items-center justify-between gap-8 p-4">
				<p class="text-center text-lg">
					We've sent a one-time code to <span class="font-semibold text-primary-400"
						>{form?.email}</span
					>. Enter the code below to sign in.
				</p>
				<form
					method="POST"
					action="?/verifyOtp"
					use:enhance={() => {
						formLoading = true;
						return async ({ update, result }) => {
							if (result.type === 'redirect') {
								goto(result.location);
							}
							formLoading = false;
							update();
						};
					}}
				>
					<label class="label mb-4">
						<span>OTP Code</span>
						<input
							class="input !rounded-md"
							type="text"
							name="otp"
							maxlength="6"
							required
							value={form?.otp ?? ''}
							inputmode="numeric"
							autocomplete="one-time-code"
							placeholder="012345"
						/>
					</label>
					<input aria-hidden class="hidden" type="hidden" name="email" value={form?.email} />
					{#if form?.error === 'Invalid OTP'}
						<p class="pb-4 pt-2">
							<span class="px-2 text-primary-500">*</span>Invalid OTP code
						</p>
					{/if}
					{#if formLoading}
						<button
							type="submit"
							class="variant-filled-primary btn btn-lg w-full rounded-md"
							disabled
							formAction={`?/verifyOtp&redirect=${redirectUrl}`}
						>
							<ProgressRadial value={undefined} width="w-8" />
						</button>
					{:else}
						<button
							type="submit"
							class="variant-filled-primary btn btn-lg w-full rounded-md"
							formAction={`?/verifyOtp&redirect=${redirectUrl}`}
						>
							Continue
						</button>
					{/if}
				</form>
			</div>
		</div>
	{/if}
	{#if form?.error && form?.error !== 'Invalid OTP'}
		<div class="alert variant-ghost-primary max-w-sm p-4">
			<p class="w-full text-center">{form?.error}</p>
		</div>
	{/if}
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_URL, PUBLIC_VERCEL_ENV } from '$env/static/public';
	import { tooManyRequestsTimer } from '$lib/utils';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { A, Alert, Button, Card, Helper, Input, Label, P, Span, Spinner } from 'flowbite-svelte';
	import GithubSolid from 'flowbite-svelte-icons/GithubSolid.svelte';
	import GoogleSolid from 'flowbite-svelte-icons/GoogleSolid.svelte';
	import type { ActionData } from '../../routes/login/$types';

	export let form: ActionData;
	export let redirectUrl: string = '';
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

<div class="flex flex-col items-center gap-8">
	{#if !form?.success && !form?.error}
		<Card class="dark:border-surface-700 dark:bg-surface-800">
			<form
				method="POST"
				class="flex flex-col space-y-6"
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
				<h3 class="text-center text-xl font-medium text-surface-900 dark:text-white">
					{actionText} with
				</h3>

				<div class="flex flex-col gap-2">
					{#if PUBLIC_VERCEL_ENV !== 'production'}
						<Button
							color="light"
							class="dark:!bg-surface-800 dark:hover:!bg-surface-700"
							title="Sign in with Google"
							on:click={signInWithGoogle}
						>
							<GoogleSolid class="me-2 h-5 w-5" />
							Google
						</Button>
					{/if}
					<!-- <button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Microsoft</button>
					<button class="btn btn-lg variant-outline-primary rounded-md">Sign in with Facebook</button> -->
					<Button
						class="dark:!bg-surface-800 dark:hover:!bg-surface-700"
						color="light"
						title="Sign in with Github"
						on:click={signInWithGithub}
					>
						<GithubSolid class="me-2 h-5 w-5" />
						Github
					</Button>
				</div>

				<div class="flex items-center justify-center p-2">
					<hr class="w-1/4 px-4" />
					<Span class="px-4">Or</Span>
					<hr class="w-1/4 px-4" />
				</div>
				<h3 class="text-center text-xl font-medium text-surface-900 dark:text-white">
					Continue with
				</h3>
				<Label class="space-y-2">
					<Span>Email</Span>
					<Input
						class="dark:bg-surface-700"
						type="email"
						name="email"
						required
						autocomplete="email"
						placeholder="Email"
					/>
				</Label>
				{#if formLoading}
					<Button type="submit" disabled formAction="?/login">
						<Spinner class="me-3" size="4" color="white" />Loading ...
					</Button>
				{:else if form?.tooManyRequests && $timer && $timer > 0}
					<Button type="submit" disabled>
						Please wait {$timer} seconds
					</Button>
				{:else}
					<Button type="submit" class="w-full" formAction="?/login">
						{actionText}
					</Button>
				{/if}
			</form>
			<P class="p-4 text-center text-sm">
				By registering you agree to PowderHound's <A href="/terms-of-use">Terms of Use</A>
				and acknowledge that you've read our
				<A href="/privacy-policy">Privacy Policy</A>.
			</P>
		</Card>
	{:else}
		<Card>
			<form
				class="flex flex-col space-y-6"
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
				<h3 class="text-center text-xl font-medium text-surface-900 dark:text-white">
					Check your email
				</h3>
				<P class="text-center">
					We've sent a one-time code to <Span
						class="font-semibold text-primary-700 dark:text-primary-400">{form?.email}</Span
					>. Enter the code below to sign in.
				</P>
				<Label class="space-y-2" color={form?.error ? 'red' : 'gray'}>
					<Span class="text-inherit">OTP Code</Span>
					<Input
						type="text"
						name="otp"
						maxlength="6"
						required
						value={form?.otp ?? ''}
						inputmode="numeric"
						autocomplete="one-time-code"
						placeholder="012345"
						color={form?.error ? 'red' : 'base'}
					/>
					{#if form?.error === 'Token has expired or is invalid'}
						<Helper class="mt-2" color="red"
							><span class="font-medium">Invalid or expired OTP code</span></Helper
						>
					{/if}
				</Label>
				<input aria-hidden class="hidden" type="hidden" name="email" value={form?.email} />
				{#if formLoading}
					<Button type="submit" disabled formAction={`?/verifyOtp&redirect=${redirectUrl}`}>
						<Spinner class="me-3" size="4" color="white" />Loading ...
					</Button>
				{:else}
					<Button type="submit" formAction={`?/verifyOtp&redirect=${redirectUrl}`}>Continue</Button>
				{/if}
			</form>
		</Card>
	{/if}
	{#if form?.error && form.error !== 'Token has expired or is invalid'}
		<Alert color="red" class="dark:bg-surface-800">
			<span class="font-semibold">Whoops! </span>
			Something went wrong. Please try again.
		</Alert>
	{/if}
</div>

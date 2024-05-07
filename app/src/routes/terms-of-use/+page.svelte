<script lang="ts">
	import PageHeading from '$lib/components/PageHeading.svelte';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	import Card from '$lib/components/card.svelte';
	import { Heading } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>PowderHound | Terms of Use</title>
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta name="description" content="View PowderHound's terms of use" />
	<meta property="og:title" content="PowderHound | Terms of Use" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/terms-of-use" />
	<meta property="og:image" content="https://powderhound.io/og?title=Terms of Use" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content="View PowderHound's terms of use" />
</svelte:head>

<PageHeading title="Terms of Use" />

<div class="flex w-full items-center justify-center">
	<enhanced:img src="../../public/logo.png" alt="Powder Hound Logo" class="h-36 w-36" />
</div>

<SectionContainer id="terms-of-use">
	<Card showHeader={false}>
		<svelte:fragment slot="header-subtitle">Updated January 25th, 2024</svelte:fragment>
		<svelte:fragment slot="body">
			<div class="flex flex-col gap-4 p-4 md:p-6">
				<p class="text-surface-700 dark:text-surface-400">
					These Terms of Use govern your access to and use of the PowderHound app. By using the app,
					you agree to comply with and be bound by these terms. If you do not agree with these
					terms, please do not use the app.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">License</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound is made available to you under the terms of the MIT license. You are granted a
					non-exclusive, revocable, and limited license to use, modify, and distribute the app in
					accordance with the terms of the MIT license.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Account Registration</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					To access certain features of the app, you may be required to create an account. You are
					responsible for maintaining the confidentiality of your account information and for all
					activities that occur under your account. You agree to provide accurate and complete
					information during the registration process.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Acceptable Use</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					You agree to use PowderHound in compliance with all applicable laws and regulations. You
					may not:
				</p>
				<ul class="list">
					<li class="list-item pb-2">Use the app for any illegal or unauthorized purpose.</li>
					<li class="list-item pb-2">Interfere with or disrupt the operation of the app.</li>
					<li class="list-item pb-2">
						Attempt to gain unauthorized access to any part of the app.
					</li>
					<li class="list-item">
						Upload or transmit any content that is unlawful, offensive, or violates the rights of
						others.
					</li>
				</ul>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Privacy</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					Your use of PowderHound is also governed by our <a href="/privacy-policy" class="anchor"
						>Privacy Policy</a
					>. By using the app, you consent to the collection, use, and disclosure of your
					information as described in the Privacy Policy.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Cookies and Analytics</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound may use cookies for enhanced user experience, and Vercel Analytics for
					aggregated usage data. Please refer to our Privacy Policy for more information on how we
					use cookies and analytics.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Open Source Nature</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound is an open source app, and its source code is publicly available. You are
					encouraged to review, contribute, and participate in the development of the app in
					accordance with the terms of the MIT license.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Risk and Liability</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound provides snowfall forecasts for informational purposes only. We are not liable
					for any damages, injuries, or losses resulting from the use of our forecasts. Users should
					understand the inherent risks associated with snow sports and backcountry travel and
					acknowledge that decisions based on PowderHound's data are made at their own risk.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Changes to Terms</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					We reserve the right to update or modify these Terms of Use at any time. Any changes will
					be effective upon posting the updated terms within the app. Your continued use of
					PowderHound after the changes constitutes acceptance of the revised terms.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Termination</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					We reserve the right to suspend or terminate your access to PowderHound at our sole
					discretion, without notice or liability, for any reason, including if you violate these
					Terms of Use.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Disclaimer of Warranty</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound is provided "as is" and without warranties of any kind. We make no guarantees
					regarding the accuracy, reliability, or availability of the app.
				</p>
				<div class="flex flex-col">
					<Heading tag="h2" class="text-xl">Contact Us</Heading>
					<hr class="mt-1 w-full opacity-80" />
				</div>
				<p class="text-surface-700 dark:text-surface-400">
					If you have any questions or concerns about these Terms of Use, please contact us at <a
						class="anchor"
						href="mailto:contact@powderhound.io">contact@powderhound.io</a
					>
				</p>
				<p class="text-surface-700 dark:text-surface-400">
					By using PowderHound, you agree to the terms outlined in these Terms of Use.
				</p>
			</div>
		</svelte:fragment>
	</Card>
</SectionContainer>

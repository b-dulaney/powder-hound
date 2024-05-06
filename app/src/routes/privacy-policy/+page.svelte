<script lang="ts">
	import PageHeading from '$lib/components/PageHeading.svelte';
	import SectionContainer from '$lib/components/SectionContainer.svelte';
	import Card from '$lib/components/card.svelte';
	import { A, Heading, Li, P, Span } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>PowderHound | Privacy Policy</title>
	<meta name="theme-color" content="#D4163C" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:site_name" content="PowderHound" />
	<meta name="description" content="View PowderHound's privacy policy" />
	<meta property="og:title" content="PowderHound | Privacy Policy" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://powderhound.io/privacy-policy" />
	<meta property="og:image" content="https://powderhound.io/og?title=Privacy Policy" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content="View PowderHound's privacy policy" />
</svelte:head>

<PageHeading title="Privacy Policy" />

<div class="flex w-full items-center justify-center">
	<enhanced:img src="../../public/logo.png" alt="Powder Hound Logo" class="h-36 w-36" />
</div>

<SectionContainer id="privacy-policy">
	<Card showHeader={false}>
		<svelte:fragment slot="header-subtitle">Updated January 25th, 2024</svelte:fragment>
		<svelte:fragment slot="body">
			<div class="flex flex-col gap-6 p-4 md:p-6">
				<p class="text-surface-700 dark:text-surface-400">
					PowderHound respects your privacy. This Privacy Policy explains how we collect, use, and
					share information about you when you use our app. By using PowderHound, you agree to the
					terms outlined in this Privacy Policy as well as the terms outlined in our Terms of Use.
					The use of the terms "the website", "the app", "the site", "we", "us", and "our" refer to
					PowderHound. The use of PowderHound is generally possible without providing personal data.
					However, if you wish to use specific features of the app such as alerts, processing of
					personal data may be necessary. If the processing of personal data is necessary, we will
					generally obtain consent from you.
				</p>
				<section id="information-collection" class="flex flex-col gap-4">
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Account Information</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						When you create an account on PowderHound, we collect and store your email address. This
						information is used to enable personalized features such as snowfall alerts.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Cookies</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						PowderHound uses cookies to enhance user experience and authenticate requests. Cookies
						are small pieces of data stored on your device that help us identify and authenticate
						you. By using cookies, we can provide a more personalized and seamless experience for
						our users. The information collected through cookies may include session data,
						preferences, and authentication tokens.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Vercel Analytics</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						PowderHound utilizes Vercel Analytics, a service that only stores anonymized data and
						does not use cookies. Vercel Analytics helps us understand how users interact with the
						app, allowing us to improve its performance and user experience. The data collected by
						Vercel Analytics is aggregated and does not include personally identifiable information.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">How We Use Your Information</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<ul>
						<li class="pb-2">
							<p class="text-surface-700 dark:text-surface-400">
								<Span class="font-semibold">Account Management</Span> - Your email address is used for
								account identification and management purposes. This includes account recovery and communication
								related to your account.
							</p>
						</li>
						<li>
							<p class="text-surface-700 dark:text-surface-400">
								<Span class="font-semibold">Snowfall Alerts</Span> - If you enable snowfall alerts, your
								email address will be used to send you notifications about snowfall based on your preferences.
							</p>
						</li>
					</ul>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Data Retention</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						We retain your account information as long as your account is active. If you choose to
						delete your account, your email address will be permanently removed from our system.
					</p>
				</section>
				<section id="third-party-information" class="flex flex-col gap-4">
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Third-Party Services</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						PowderHound may use third-party services for email delivery and notification purposes.
						These services are selected based on their commitment to privacy and security.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Links to other Sites</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						PowderHound may contain links to websites that we do not control. When you click on a
						third-party link, you will be sent to that third-party's website. We strongly recommend
						that you read the Privacy Policies of any website you visit. We have no control over,
						and accept no responsibility for, any third-party website or services' content, privacy
						policies, or practices.
					</p>
				</section>
				<section id="final-notices" class="flex flex-col gap-4">
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Security</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						We take reasonable measures to protect the security of your information. However, please
						be aware that no method of transmission over the internet or electronic storage is
						entirely secure.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Your Choices</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						You have the right to access, update, or delete your account information. You can make
						these changes within the app's settings or by contacting us directly.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Open Source Nature</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						As an open source app under the MIT license, the source code of PowderHound is publicly
						available. Users are encouraged to review the code and contribute to the improvement of
						the app's privacy and security features.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Changes to this Privacy Policy</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						We may update this Privacy Policy from time to time. Any changes will be effective upon
						posting the updated policy on our website.
					</p>
					<div class="flex flex-col">
						<Heading tag="h2" class="text-xl">Contact Us</Heading>
						<hr class="mt-1 w-full opacity-80" />
					</div>
					<p class="text-surface-700 dark:text-surface-400">
						If you have any questions or concerns about this Privacy Policy, please contact us at <A
							href="mailto:contact@powderhound.io">contact@powderhound.io</A
						>
					</p>
				</section>
			</div>
		</svelte:fragment>
	</Card>
</SectionContainer>

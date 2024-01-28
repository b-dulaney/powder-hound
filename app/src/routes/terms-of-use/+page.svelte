<script lang="ts">
    import Card from '$lib/components/card.svelte';
    </script>

<section id="header-section">
    <div class="mx-auto w-full lg:max-w-[90rem] md:px-4 pb-2 pt-4 md:pb-4 lg:pt-8">
        <ol class="breadcrumb lg:text-lg px-4 md:px-0 pb-5">
            <li class="crumb"><a class="anchor !text-surface-300" href="/">Home</a></li>
            <li class="crumb-separator" aria-hidden>&rsaquo;</li>
            <li class="text-surface-300">Terms of Use</li>
        </ol>
            <div class="flex flex-col justify-center items-center">
                <enhanced:img src='../../public/new-logo-v2.png' alt="Powder Hound Logo" class="h-36 w-36" />
                <h1 class="h1 !text-4xl">Terms of Use</h1>
            </div>
        </div>
</section>

<section id="terms-of-use">
    <div class="mx-auto w-full lg:max-w-[90rem] px-4 pb-2 pt-4 md:pb-4 lg:pt-8">
    <Card>
        <svelte:fragment slot="header-subtitle">Updated January 25th, 2024</svelte:fragment>
        <svelte:fragment slot="body">
            <div class="flex flex-col gap-4 p-4">
                <p>These Terms of Use govern your access to and use of the PowderHound app. By using the app, you agree to comply with and be bound by these terms. If you do not agree with these terms, please do not use the app.</p>
                <h2 class="h2 md:h3 md:!font-light underline">License</h2>
                <p>PowderHound is made available to you under the terms of the MIT license. You are granted a non-exclusive, revocable, and limited license to use, modify, and distribute the app in accordance with the terms of the MIT license.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Account Registration</h2>
                <p>To access certain features of the app, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information during the registration process.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Acceptable Use</h2>
                <p>You agree to use PowderHound in compliance with all applicable laws and regulations. You may not:</p>
                <ul>
                    <li class="list-item pb-2">Use the app for any illegal or unauthorized purpose.</li>
                    <li class="list-item pb-2">Interfere with or disrupt the operation of the app.</li>
                    <li class="list-item pb-2">Attempt to gain unauthorized access to any part of the app.</li>
                    <li class="list-item">Upload or transmit any content that is unlawful, offensive, or violates the rights of others.</li>
                </ul>
                <h2 class="h2 md:h3 md:!font-light underline">Privacy</h2>
                <p>Your use of PowderHound is also governed by our Privacy Policy. By using the app, you consent to the collection, use, and disclosure of your information as described in the Privacy Policy.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Cookies and Analytics</h2>
                <p>PowderHound may use cookies for enhanced user experience, and Vercel Analytics for aggregated usage data. Please refer to our Privacy Policy for more information on how we use cookies and analytics.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Open Source Nature</h2>
                <p>PowderHound is an open source app, and its source code is publicly available. You are encouraged to review, contribute, and participate in the development of the app in accordance with the terms of the MIT license.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Risk and Liability</h2>
                <p>PowderHound provides snowfall forecasts for informational purposes only. We are not liable for any damages, injuries, or losses resulting from the use of our forecasts. Users should understand the inherent risks associated with snow sports and backcountry travel and acknowledge that decisions based on PowderHound's data are made at their own risk.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Changes to Terms</h2>
                <p>We reserve the right to update or modify these Terms of Use at any time. Any changes will be effective upon posting the updated terms within the app. Your continued use of PowderHound after the changes constitutes acceptance of the revised terms.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Termination</h2>
                <p>We reserve the right to suspend or terminate your access to PowderHound at our sole discretion, without notice or liability, for any reason, including if you violate these Terms of Use.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Disclaimer of Warranty</h2>
                <p>PowderHound is provided "as is" and without warranties of any kind. We make no guarantees regarding the accuracy, reliability, or availability of the app.</p>
                <h2 class="h2 md:h3 md:!font-light underline">Contact Us</h2>
                <p>If you have any questions or concerns about these Terms of Use, please contact us at <a class="anchor" href="mailto:contact@powderhound.io">contact@powderhound.io</a>
                </p>
                <p>By using PowderHound, you agree to the terms outlined in these Terms of Use.</p>
            </div>
        </svelte:fragment>
    </Card>
    </div>
</section>
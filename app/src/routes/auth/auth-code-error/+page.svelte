<script>
    import { onMount } from 'svelte';

    let error = '';
    let errorCode = '';
    let errorDescription = '';

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        error = urlParams.get('error') ?? 'Server error';
        errorCode = urlParams.get('error_code') ?? '500';
        errorDescription = urlParams.get('error_description') ?? 'An unknown error occured. If this persists, please contact support at contact@powderhound.io';
    });
</script>

    <section id="error-description" class="mt-12">
        <div class="flex flex-col items-center gap-4 p-4">
            <h1 class="h1 text-primary-500">HTTP {errorCode}</h1>
            <h2 class="h2">{errorDescription}</h2>
            <a class="anchor xl:text-lg !text-surface-50 pt-8" href="/">Back to Home</a>
        </div>
    </section>


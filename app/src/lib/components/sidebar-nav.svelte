<script lang="ts">
    export let drawerClose: () => void;
    export let logout: () => void;
    export let session: any;
</script>

<section class="p-4 space-y-4 overflow-y-auto pb-20">
    <p class="font-bold pl-4 text-2xl">Conditions</p>
    <nav class="list-nav">
        <ul>
            <li>
                <a href="/conditions" on:click={drawerClose}>
                    <span class="flex-auto">Ski Resorts</span>
                </a>
            </li>
            <li>
                <a href="/conditions" on:click={drawerClose}>
                    <span class="flex-auto">Backcountry</span>
                </a>
            </li>
        </ul>
    </nav>
    <hr class="!my-6 opacity-50" />
    <p class="font-bold pl-4 text-2xl">Profile</p>
    <nav class="list-nav">
        {#if session}
        <ul>
            <li>
                <a href="/alerts" on:click={drawerClose}>
                    <span class="flex-auto">Alerts</span>
                </a>
            </li>
            <li>
                <button class="w-full text-start" on:click={logout}>
                    <span class="flex-auto">Logout</span>
                </button>
            </li>
        </ul>
        {:else}
        <ul>
            <li>
                <a href="/signup" on:click={drawerClose}>
                    <span class="flex-auto">Sign Up</span>
                </a>
            </li>
            <li>
                <a href="/login" on:click={drawerClose}>
                    <span class="flex-auto">Login</span>
                </a>
            </li>
        </ul>
        {/if}
    </nav>
    <hr class="!my-6 opacity-50" />
    <p class="font-bold pl-4 text-2xl">About</p>
    <nav class="list-nav">
        <ul>
            <li>
                <a href="https://github.com/b-dulaney/powder-hound" on:click={drawerClose}>
                    <span class="flex-auto">Github</span>
                </a>
            </li>
            <li>
                <a href="mailto:contact@powderhound.com" target="_blank" rel="noopener" on:click={drawerClose}>
                    <span class="flex-auto">Contact</span>
                </a>
            </li>
            <li>
                <a href="/privacy-policy" on:click={drawerClose}>
                    <span class="flex-auto">Privacy Policy</span>
                </a>
            </li>
            <li>
                <a href="/terms-of-use" on:click={drawerClose}>
                    <span class="flex-auto">Terms of Use
                    </span>
                </a>
            </li>
        </ul>
    </nav>
</section>
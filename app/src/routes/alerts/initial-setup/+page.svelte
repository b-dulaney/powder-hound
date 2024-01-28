<script lang="ts">
    import { Stepper, Step, InputChip, Autocomplete, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
    export let data: PageData;
    const { userExists, supabase, mountainData, userId, email } = data;
    let inputChip = '';
    let inputChipList: string[] = [];

    interface AlertThreshold {
        mountain_id: number;
        name: string;
        threshold: number;
    }

    const alertThresholds: AlertThreshold[] = [];

    const autoCompleteOptions: AutocompleteOption<string>[] = mountainData?.map((m) => ({
        label: m.display_name,
        value: m.display_name
    }))

    function onInputChipSelect(e: CustomEvent<AutocompleteOption<string>>) {
        inputChipList = [...inputChipList, e.detail.label];
        const mountain = mountainData?.find((m) => m.display_name === e.detail.label);
        alertThresholds.push({
            mountain_id: mountain?.mountain_id!,
            name: mountain?.display_name!,
            threshold: 1
        })
    }

    function onSnowfallSelect(e: Event, name: string) {
        alertThresholds.find((a) => a.name === name).threshold = Number(e?.target?.value);
    }

    async function onComplete() {
        const {error: profileError} = await supabase.from('profile').insert({
            user_id: userId,
            email, 
            favorites: alertThresholds.map((i) => i.mountain_id),
        })
        
        const {error: alertError} = await supabase.from('user_alerts').insert(alertThresholds.map((a) => ({
            user_id: userId,
            email,
            display_name: a.name,
            mountain_id: a.mountain_id,
            threshold_inches: a.threshold,
        })))

        if (profileError || alertError) {
            console.error(profileError, alertError);
        }
        goto('/conditions', {replaceState: true});
    }

</script>

<div class="w-full max-h-full flex justify-center p-4">
    {#if !userExists}
        <div class="flex flex-col gap-4">
            <h1 class="h1 text-center !text-3xl">Set up Alerts</h1>
            <div class="card w-full p-4 max-h-full overflow-y-auto">
                <Stepper on:complete={onComplete}>
                    <Step>
                        <svelte:fragment slot="header">Favorite Locations</svelte:fragment>
                        <p class="max-w-xl">Select the locations that we'll send you snowfall alerts for. You can add more at any time.</p>
                        <div class="flex flex-col gap-2 mt-4 items-center">
                            <InputChip class="max-w-sm md:max-w-xl" bind:input={inputChip} bind:value={inputChipList} name="chips" chips="variant-filled-secondary" placeholder='Search...' allowUpperCase />

                            <div class="card w-full variant-ghost-surface max-w-sm md:max-w-xl max-h-56 p-4 overflow-y-auto" tabindex="-1">
                                <Autocomplete
                                    bind:input={inputChip}
                                    options={autoCompleteOptions}
                                    denylist={inputChipList}
                                    on:selection={onInputChipSelect}
                                />
                            </div>
                    </Step>
                    <Step>
                        <svelte:fragment slot="header">Snowfall Alerts</svelte:fragment>
                        <p class="max-w-xl">You'll receive two types of notifications based on the thresholds you set:</p>  
                        <div class="flex flex-col gap-2 mt-4">
                            <p class="max-w-xl">
                                <strong class="text-secondary-400">Forecast Alerts</strong> - To help you plan ahead, we'll send these in the afternoon and report snowfall expected in the next 24 hours.
                            </p>
                            <p class="max-w-xl">
                                <strong class="text-secondary-400">Overnight Alerts</strong> - You'll get these early in the AM, confirming overnight or past 24 hour snowfall. They're the indicator of whether you should draft that sick day email to your boss.
                            </p>
                        </div>
                        <div class="flex flex-col gap-2 py-4">
                            {#if inputChipList.length > 0}
                            {#each inputChipList as chip (chip)}
                            <div class="flex justify-between items-center gap-2">
                                <p class="flex-auto font-semibold">{chip}</p>
                                <select class="select w-1/2 md:w-1/3 text-center" on:change={(e)=> onSnowfallSelect(e, chip)} value={alertThresholds.find((v) => v.name === chip)?.threshold}>
                                    <option value={1}>1+ inch</option>
                                    <option value={3}>3+ inches</option>
                                    <option value={6}>6+ inches</option>
                                    <option value={12}>12+ inches</option>
                                </select>
                            </div>
                        {/each}
                        {:else}
                        <p class="text-center text-surface-400 py-4">No favorites selected.</p>
                        {/if}
                        </div>
                    </Step>
                    <Step class="max-w">
                        <svelte:fragment slot="header">Review Alerts</svelte:fragment>
                        {#if !alertThresholds.length}
                            <p class="text-center text-surface-400 py-4 max-w-xl">No alerts configured. You can set them up at any time in the future.</p>
                        {:else}
                        <p class="max-w-xl">You'll receive forecast and overnight alerts for the following locations and thresholds:</p>
                        <div class="flex flex-col gap-2 py-4 w-full">
                            {#each alertThresholds as alert (alert)}
                            <div class="flex justify-between w-full items-center gap-2">
                                <p class="flex-auto font-semibold">{alert.name}</p>
                                <p>{alert.threshold}+ inches</p>
                            </div>
                            {/each}
                        </div>
                        {/if}
                    </Step>
                </Stepper>
            </div>
        </div>
    {/if}
</div>
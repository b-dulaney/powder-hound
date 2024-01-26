<script lang="ts">
    export let dangerLevel = 0;
    export let size = '100px';
    
    let iconName: string;
    $: {
        switch (dangerLevel) {
            case 0:
                iconName = 'No Rating';
                break;
            case 1:
                iconName = 'Low';
                break;
            case 2:
                iconName = 'Moderate';
                break;
            case 3:
                iconName = 'Considerable';
                break;
            case 4:
                iconName = 'High';
                break;
            case 5:
                iconName = 'Extreme';
                break;
            default:
                iconName = 'No Rating';
        }
    }
</script>

{#if dangerLevel === 0}
<enhanced:img src='../../public/avy-danger-no-rating.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{:else if dangerLevel === 1}
<enhanced:img src='../../public/avy-danger-low.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{:else if dangerLevel === 2}
<enhanced:img src='../../public/avy-danger-moderate.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{:else if dangerLevel === 3}
<enhanced:img src='../../public/avy-danger-considerable.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{:else if dangerLevel === 4}
<enhanced:img src='../../public/avy-danger-high.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{:else if dangerLevel === 5}
<enhanced:img src='../../public/avy-danger-high.png' alt={`Avalanche danger: ${iconName}`} style="width: {size}" />
{/if}
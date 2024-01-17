<script lang="ts">
    export let dangerLevel = 0;
    export let size = '100px';
    import AvyDangerConsiderable from '../../public/avy-danger-considerable.png';
    import AvyDangerHigh from '../../public/avy-danger-high.png';
    import AvyDangerLow from '../../public/avy-danger-low.png';
    import AvyDangerModerate from '../../public/avy-danger-moderate.png';
    import AvyDangerNoRating from '../../public/avy-danger-no-rating.png';

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
<img src={AvyDangerNoRating} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{:else if dangerLevel === 1}
<img src={AvyDangerLow} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{:else if dangerLevel === 2}
<img src={AvyDangerModerate} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{:else if dangerLevel === 3}
<img src={AvyDangerConsiderable} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{:else if dangerLevel === 4}
<img src={AvyDangerHigh} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{:else if dangerLevel === 5}
<img src={AvyDangerHigh} alt={`Avalanche danger: ${iconName}`} style={`height: ${size};`} />
{/if}
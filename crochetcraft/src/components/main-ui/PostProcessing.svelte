<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import NumericSlider from './NumericSlider.svelte';

    let { position }: { position: PanelPosition } = $props();

    // Initializing variables:
    let laxity = $state(0);
    let hookSize = $state(5);
    let thickness = $state(5);
</script>

<Panel title="Post-Processing" {position} shown={State.selectedMeshes.length > 0}>
    {#if State.selectedMeshes.length > 0}
        <label class="label">
            <span>Render Scale</span>
            <NumericSlider
                bind:value={thickness}
                min={1}
                max={20}
                sliderMin={2}
                sliderMax={10}
                sliderStep={0.5}
            />
        </label>

        <label class="label">
            <span>Stitch Colour</span>
            <input type="color" class="input block !rounded-full" />
        </label>
    {:else}
        <p class="text-center opacity-50">Nothing selected.</p>
    {/if}
</Panel>

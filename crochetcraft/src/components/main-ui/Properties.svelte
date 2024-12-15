<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import NumericSlider from './NumericSlider.svelte';

    // Initializing variables:
    let laxity = $state(0);
    let hookSize = $state(5);
    let thickness = $state(5);
</script>

<Panel title="Properties" position="right" shown={!!State.selectedMesh}>
    <label class="label">
        <span>Stitch Laxity</span>
        <NumericSlider
            bind:value={laxity}
            min={0}
            max={20}
            sliderMin={0}
            sliderMax={2}
            sliderStep={0.1}
        />
    </label>

    <label class="label">
        <span>Hook Size (mm)</span>
        <NumericSlider
            bind:value={hookSize}
            min={1}
            max={20}
            sliderMin={2}
            sliderMax={10}
            sliderStep={0.5}
        />
    </label>

    <label class="label">
        <span>Stitch Thickness (mm)</span>
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
</Panel>

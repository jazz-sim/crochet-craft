<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
    // Initializing variables:
    let stitchLaxityValue = 0;
</script>

<Panel --left="calc(99vw - 400px)">
    <div slot="panel-title">
        <h4 class="h4">Properties</h4>
    </div>
    <div slot="panel-elements">
        <p>Stitch Laxity: {stitchLaxityValue}</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input
                bind:value={stitchLaxityValue}
                id="stitchLaxitySlider"
                type="range"
                min="0"
                step="0.01"
                max="1.5"
            />
        </div>
        <p>Stitch Hooksize:</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input type="text" placeholder="Numerical stitch hooksize" />
            <div class="input-group-shim">mm</div>
        </div>
        <p>Stitch Thickness:</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input type="text" placeholder="Numerical stitch thickness" />
            <div class="input-group-shim">mm</div>
        </div>
        <p>Stitch Colour:</p>
        <input type="color" value="#ff0000" />
    </div>
</Panel>

<style>
    .no-background {
        background: none;
        background-color: none;
    }
</style>

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
        <p>Stitch Laxity:</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">{stitchLaxityValue}%</div>
            <input
                bind:value={stitchLaxityValue}
                id="stitchLaxitySlider"
                type="range"
                min="0"
                max="100"
            />
        </div>
        <p>Stitch Hooksize:</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input type="text" placeholder="Numerical stitch hooksize" />
            <select>
                <option>Units</option>
            </select>
        </div>
        <p>Stitch Thickness:</p>
        <div class="no-background input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <input type="text" placeholder="Numerical stitch thickness" />
            <select>
                <option>Units</option>
            </select>
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
    input[type='range'] {
        width: 100px;
    }
</style>

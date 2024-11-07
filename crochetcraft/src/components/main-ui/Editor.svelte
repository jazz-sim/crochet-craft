<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
</script>

<Panel --left="1vw">
    <div slot="panel-title">
        <h4 class="h4">Pattern</h4>
    </div>
    <div slot="panel-elements">
        <textarea
            class="textarea"
            rows="4"
            placeholder="Begin by entering your crochet pattern here, e.g. F. ch 11, sc 12"
        />
        <br /><br />
        <button class="variant-filled-primary btn">Add Stitch</button>
        <button class="variant-filled-primary btn">Next Stitch Colour</button>
    </div>
</Panel>

<style>
    button {
        display: block;
        margin-bottom: 10px;
    }
</style>

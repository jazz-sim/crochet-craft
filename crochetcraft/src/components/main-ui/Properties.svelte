<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
</script>

<Panel>
    <label>X: <input type="range" min="-10" max="10" /></label>
    <label>Y: <input type="range" min="-10" max="10" /></label>
    <label>Z: <input type="range" min="1" max="20" /></label>
    <textarea placeholder="hi i am a textbox"></textarea>
    <button on:click={() => alert('Overlay Button Clicked!')}>Click Me!</button>
</Panel>

<style>
    label,
    button {
        display: block;
        margin-bottom: 10px;
    }
    input[type='range'] {
        width: 100px;
    }
</style>

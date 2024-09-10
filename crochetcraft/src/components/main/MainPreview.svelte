<script>
    import Canvas from "../canvas/Canvas.svelte";

</script>

<style>
    #preview {
        background-color: gray;
        flex: auto;
    }
</style>

<div id="preview">
    <Canvas animate={(last, frame) => {}}/>
</div>

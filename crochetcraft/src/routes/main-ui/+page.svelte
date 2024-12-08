<script lang="ts">
    import '../../app.css';
    import '../../styles/global.css';
    import Editor from '$components/main-ui/Editor.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
    import Canvas from '$components/canvas/Canvas.svelte';
    import Properties from '$components/main-ui/Properties.svelte';

    let toolbar: Toolbar;
</script>

<div id="container-div">
    <Toolbar bind:this={toolbar} />
    <div id="render-div">
        <Canvas />
        <Editor />
        <Properties />
    </div>
</div>

<style>
    :global(*) {
        box-sizing: border-box;
    }
    :global(body, html) {
        height: 100%;
        width: 100%;
        min-height: 100%;
        margin: 0;
        padding: 0;
    }
    #container-div {
        display: flex;
        flex-flow: column;
        height: 100%;
        max-height: 100%;
    }
    #render-div {
        position: relative;
        flex: 1;
        min-height: 0;
    }
</style>

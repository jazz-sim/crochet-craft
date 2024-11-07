<script lang="ts">
    import Editor from '$components/main-ui/Editor.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
    import Preview from '$components/main-ui/Preview.svelte';
    import Properties from '$components/main-ui/Properties.svelte';
</script>

<div id="sample-ui-div">
    <Toolbar />
    <Editor />
    <Preview />
    <Properties />
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
    #sample-ui-div {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        border-top: solid;
    }
</style>

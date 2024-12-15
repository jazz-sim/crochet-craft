<script lang="ts">
    import Canvas from '$components/canvas/Canvas.svelte';
    import Editor from '$components/main-ui/Editor.svelte';
    import Properties from '$components/main-ui/Properties.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';

    let toolbar: Toolbar;
</script>

<div class="flex h-full flex-col">
    <Toolbar bind:this={toolbar} />
    <div id="render-div" class="relative min-h-0 flex-1">
        <Canvas />
        <Editor />
        <Properties />
    </div>
</div>

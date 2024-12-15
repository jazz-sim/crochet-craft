<script lang="ts">
    import Canvas from '$components/canvas/Canvas.svelte';
    import Editor from '$components/main-ui/Editor.svelte';
    import Properties from '$components/main-ui/Properties.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
</script>

<div class="flex h-full flex-col">
    <Toolbar />
    <div id="render-div" class="relative flex min-h-0 flex-1 flex-row">
        <Editor position="docked" />
        <Canvas />
        <Properties position="docked" />
    </div>
</div>

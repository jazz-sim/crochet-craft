<script lang="ts">
    import Canvas from '$components/canvas/Canvas.svelte';
    import Editor from '$components/main-ui/Editor.svelte';
    import PostProcessing from '$components/main-ui/PostProcessing.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
    import FloatingToolbar from '$components/main-ui/FloatingToolbar.svelte';
</script>

<div class="flex h-full flex-col">
    <Toolbar />
    <div id="render-div" class="relative flex min-h-0 flex-1 flex-row">
        <Editor position="docked" />
        <Canvas />
        <PostProcessing position="right" />
        <FloatingToolbar />
    </div>
</div>

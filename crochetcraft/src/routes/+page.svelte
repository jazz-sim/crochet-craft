<script lang="ts">
    import Editor from '$components/main-ui/Editor.svelte';
    import PostProcessing from '$components/main-ui/PostProcessing.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
    import FloatingToolbar from '$components/main-ui/FloatingToolbar.svelte';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import State from '$lib/state.svelte';
    import { Scene, Vector3 } from 'three';
</script>

<div class="cover flex h-full flex-col">
    <Toolbar />
    <div id="render-div" class="relative flex min-h-0 flex-1 flex-row">
        <Editor position="docked" />
        <ThreeCanvas
            --height="100%"
            toggleBloom={true}
            cameraPosition={new Vector3(0, 0, 10)}
            init={(scene: Scene) => {
                State.scene = scene;
            }}
        />
        <PostProcessing position="right" />
        <FloatingToolbar />
    </div>
</div>

<style>
    @media (orientation: portrait) {
        .cover {
            visibility: hidden;
        }
    }
</style>

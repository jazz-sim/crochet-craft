<script lang="ts">
    import Editor from '$components/main-ui/Editor.svelte';
    import PostProcessing from '$components/main-ui/PostProcessing.svelte';
    import Toolbar from '$components/main-ui/Toolbar.svelte';
    import FloatingToolbar from '$components/main-ui/FloatingToolbar.svelte';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import State from '$lib/state.svelte';
    import { Scene, Vector3 } from 'three';
</script>

<div>
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
    <div class="small-screen flex flex-col">
        <div class="flex items-center justify-center pt-5">
            <img src="/cc-logo-new-1-purple.png" width="65%" alt="CrochetCraft logo." />
        </div>
        <div class="flex items-center justify-center p-5">
            <p>
                CrochetCraft looks and works a lot better on desktop, or something with a wider
                screen!
            </p>
        </div>
    </div>
</div>

<style>
    @media (aspect-ratio <= 3/2) {
        .cover {
            content-visibility: hidden;
            visibility: collapse;
        }
        .small-screen {
            content-visibility: visible;
            visibility: visible;
        }
    }
    @media (aspect-ratio > 3/2) {
        .cover {
            content-visibility: visible;
            visibility: visible;
        }
        .small-screen {
            content-visibility: hidden;
            visibility: collapse;
        }
    }
</style>

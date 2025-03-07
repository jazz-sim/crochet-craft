<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import State from '$lib/state.svelte';
    import { Mesh, AxesHelper } from 'three';

    let currAxesHelper = State.scene.getObjectByName('axesHelper') as AxesHelper;

    function selectAllStitches() {
        // Remove mesh from the hover state:
        State.hoverMesh = null;
        // Every mesh in the scene needs to be added to the selectedMeshes state:
        State.scene.traverse(function (item) {
            if (item instanceof Mesh && !State.selectedMeshes.includes(item)) {
                State.selectedMeshes.push(item);
            }
        });
    }

    function reCenterModel() {
        // We just need to move the camera to the original position:
        State.camera?.position.set(0, 0, 10);
        State.camera?.updateProjectionMatrix();
        State.controls?.update();
    }

    function toggleAxesHelperVisibility() {
        currAxesHelper.visible = !currAxesHelper.visible;
    }
</script>

<div class="absolute bottom-2 right-2 z-10 flex flex-row gap-4 rounded-lg">
    <button
        class="variant-filled-surface btn btn-xl rounded-lg p-2"
        aria-label="Select all stitches"
        title="Select all stitches"
        onclick={selectAllStitches}
    >
        <i class="fi fi-br-multiple"></i>
    </button>
    <button
        class="variant-filled-surface btn btn-xl rounded-lg p-2"
        aria-label="Re-center model"
        title="Re-center model"
        onclick={reCenterModel}
    >
        <i class="fi fi-br-expand"></i>
    </button>
    <button
        class="variant-filled-surface btn btn-xl rounded-lg p-2"
        aria-label="Toggle axes helper"
        title={'Toggle axes helper '.concat(
            typeof currAxesHelper !== 'undefined' && currAxesHelper.visible
                ? '(turn off)'
                : '(turn on)',
        )}
        onclick={toggleAxesHelperVisibility}
    >
        <i
            class={typeof currAxesHelper !== 'undefined' && currAxesHelper.visible
                ? 'fi fi-br-cube'
                : 'fi fi-br-model-cube-arrows'}
        ></i>
    </button>
</div>

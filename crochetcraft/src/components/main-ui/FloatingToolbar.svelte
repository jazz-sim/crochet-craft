<script lang="ts">
    import State from '$lib/state.svelte';
    import { Mesh } from 'three';

    let axesToggleTitle = 'Toggle axes helper (turn off)';
    let axesToggleIcon = 'fi fi-br-cube';

    let algoToggleTitle = 'Toggle placer algorithm (change to GD - gradient descent)';
    let algoToggleText = '↪ GD';

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
        if (State.axesHelper !== null) {
            State.axesHelper.visible = !State.axesHelper.visible;
            axesToggleTitle = 'Toggle axes helper '.concat(
                State.axesHelper.visible ? '(turn off)' : '(turn on)',
            );
            axesToggleIcon = State.axesHelper.visible
                ? 'fi fi-br-cube'
                : 'fi fi-br-model-cube-arrows';
        }
    }

    function togglePlacerAlgorithm() {
        State.placerAlgo = !State.placerAlgo;
        algoToggleTitle = 'Toggle placer algorithm '.concat(
            State.placerAlgo
                ? '(change to GD - gradient descent)'
                : '(change to IF - iterative forces)',
        );
        algoToggleText = State.placerAlgo ? '↪ GD' : '↪ IF';
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
        title={axesToggleTitle}
        onclick={toggleAxesHelperVisibility}
    >
        <i class={axesToggleIcon}></i>
    </button>
    <button
        class="variant-filled-surface btn btn-xl rounded-lg p-2"
        aria-label="Toggle placer algorithm"
        title={algoToggleTitle}
        onclick={togglePlacerAlgorithm}
    >
        <b class="pl-1 pr-1 text-base">{algoToggleText}</b>
    </button>
</div>

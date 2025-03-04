<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import NumericSlider from './NumericSlider.svelte';
    import * as THREE from 'three';

    let { position }: { position: PanelPosition } = $props();

    // Initializing variables:
    let thickness = $state(5);

    // Checking if all stitch meshes have been selected:
    function checkAllMeshesSelected() {
        // Check if every mesh in the scene is actually in the state selectedMeshes array:
        let itemCheck: Boolean[] = [];
        State.scene.traverse(function (item) {
            if (item instanceof THREE.Mesh && !State.selectedMeshes.includes(item)) {
                itemCheck.push(false);
            } else {
                itemCheck.push(true);
            }
        });
        return itemCheck.every((x) => x === true);
    }
    // Updating stitch(es) colour(s):
    function updateStitchColour(colour: string) {
        // Maybe should not type e as any T_T
        for (let mesh of State.selectedMeshes) {
            let currentMaterial = mesh.material as THREE.MeshLambertMaterial;
            let newColour = parseInt(colour.replace('#', '0x'));
            currentMaterial.color.setHex(newColour);
            currentMaterial.emissive.setHex(newColour);
        }
    }
</script>

<Panel title="Post-Processing" {position} shown={State.selectedMeshes.length > 0}>
    {#if State.selectedMeshes.length > 0}
        {#if checkAllMeshesSelected() == true}
            <label class="label">
                <span>Render Scale</span>
                <NumericSlider
                    bind:value={thickness}
                    min={1}
                    max={20}
                    sliderMin={2}
                    sliderMax={10}
                    sliderStep={0.5}
                />
            </label>
        {/if}
        <label class="label">
            <span>Stitch Colour</span>
            <input
                type="color"
                class="input block !rounded-full"
                value={new Set(
                    State.selectedMeshes.map(
                        (x) => (x.material as THREE.MeshLambertMaterial).color,
                    ),
                ).size === 1
                    ? '#'.concat(
                          (
                              (State.selectedMeshes[0] as THREE.Mesh)
                                  .material as THREE.MeshLambertMaterial
                          ).color.getHexString(),
                      )
                    : State.nextStitchColour}
                onchange={(event) => updateStitchColour(event.currentTarget.value)}
            />
        </label>
    {:else}
        <p class="text-center opacity-50">Nothing selected.</p>
    {/if}
</Panel>

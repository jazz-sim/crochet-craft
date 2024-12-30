<script lang="ts">
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { parse, link, place, elaborate } from 'crochet-stitcher';
    import { placeDebugSpheres } from '$lib/render/debug';

    // Scene objects
    let scene: THREE.Scene;
    let mainGroup: THREE.Group = new THREE.Group();

    const sampleInputs: { [key: string]: string } = {
        'default chain': 'ch 10',
        'long chain': 'ch 100',
        '3x3 square': 'ch 3, turn, sc 3, turn, sc3',
        '3x10 rectangle': 'ch 10, turn, sc 10, turn, sc10',
        'Janky chain': 'ch 5, turn, sc 5, ch 5, turn, sc 4, ch 3, sc 6',
    };
    const sampleNames = Object.keys(sampleInputs);
    let selectedSampleName = 'default chain';
    let doElaboration = false;

    $: {
        const currentSample = sampleInputs[selectedSampleName];
        mainGroup.clear();

        if (doElaboration) {
            const elaboratedPoints = elaborate(place(link(parse(currentSample))));
            console.log(elaboratedPoints);
            elaboratedPoints.forEach((mesh) => mainGroup.add(mesh));
        } else {
            const placedPoints = place(link(parse(currentSample)));

            placeDebugSpheres(
                placedPoints.stitches.map(
                    (p) => new Vector3(p.position.x, p.position.y, p.position.z),
                ),
                mainGroup,
            );
        }
        scene?.add(mainGroup);
    }
</script>

<div id="wrapper">
    <ThreeCanvas bind:scene />

    <div id="input-wrapper">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
        <br /><br />
        <p><i>Demonstrations:</i></p>
        <select class="select" bind:value={selectedSampleName}>
            {#each sampleNames as sampleStr}
                <option value={sampleStr}>{sampleStr}</option>
            {/each}
        </select>
        <br /><br />
        <label
            ><i>Do elaboration?</i>
            <input type="checkbox" bind:checked={doElaboration} />
        </label>
    </div>
</div>

<style>
    #wrapper {
        display: flex;
    }

    #input-wrapper {
        padding: 0.5em;
        min-width: 350px;
        flex: 0 0;
        max-height: 100vh;
        overflow-y: scroll;
        scroll-behavior: auto;
    }
</style>

<script lang="ts">
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { parse, link, place, elaborate, gdPlace } from 'crochet-stitcher';
    import { placeDebugSpheres } from '$lib/render/debug';
    import type { LinkedStitch, Pattern } from 'crochet-stitcher/types';

    // Scene objects
    let scene: THREE.Scene;
    let mainGroup: THREE.Group = new THREE.Group();

    let placerAlgorithm: 'if' | 'gd' = 'gd';
    let placerMaxIterations = 50;

    const sampleInputs: { [key: string]: string } = {
        'default chain': 'ch 10',
        'long chain': 'ch 100',
        '3x3 square': 'ch 4, turn, sc 3, ch1, turn, sc3',
        '3x10 rectangle': 'ch 11, turn, sc 10, ch1, turn, sc10',
        'Janky chain': 'ch 6, turn, sc 5, ch 6, turn, sc 4, ch 3, sc 6',
        '5x10 cylinder': 'ch 10, sc 40',
        '10x20 cylinder': 'ch 20, sc 180',
        '20x30 cylinder': 'ch 30, sc 570',
    };
    const sampleNames = Object.keys(sampleInputs);
    let selectedSampleName = 'default chain';
    let doElaboration = false;

    $: {
        const currentSample = sampleInputs[selectedSampleName];
        mainGroup.clear();
        const placer = {
            if: place,
            gd: (pat: Pattern<LinkedStitch>) => gdPlace(pat, placerMaxIterations),
        }[placerAlgorithm];

        if (doElaboration) {
            const elaboratedPoints = elaborate(placer(link(parse(currentSample))));
            console.log(elaboratedPoints);
            elaboratedPoints.forEach((mesh) => mainGroup.add(mesh));
        } else {
            const placedPoints = placer(link(parse(currentSample)));

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

        <label class="label">
            <span>Placer algorithm</span>
            <select class="select" bind:value={placerAlgorithm}>
                <option value="if">IF</option>
                <option value="gd">GD</option>
            </select>
        </label>

        <label class="label">
            <span>Maximum iterations for placer: {placerMaxIterations}</span>
            <input type="range" bind:value={placerMaxIterations} min={0} max={1000} step={1} />
        </label>

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

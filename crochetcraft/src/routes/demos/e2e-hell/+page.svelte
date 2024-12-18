<script lang="ts">
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { parse, link, place } from 'crochet-stitcher';
    import { placeDebugSpheres } from '$lib/render/debug';

    // Scene objects
    let scene: THREE.Scene;
    let mainGroup: THREE.Group = new THREE.Group();

    const sampleInputs: string[] = ['ch 3, turn, sc 3'];
    const placedPoints = place(link(parse(sampleInputs[0])));

    placeDebugSpheres(
        placedPoints.stitches.map((p) => new Vector3(p.position.x, p.position.y, p.position.z)),
        mainGroup,
    );

    $: {
        scene?.add(mainGroup);
    }
</script>

<div id="wrapper">
    <ThreeCanvas bind:scene />

    <div id="input-wrapper">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
        <br /><br />
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

<script lang="ts">
    import { makeMultiBezier } from '$lib/builder/bezier';
    import { arrayToVector3List } from '$lib/geometry/vectorHelper';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import StitchModel from 'crochet-stitcher/models';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

    let scene: THREE.Scene;
    const group = new THREE.Group();
    let whichModel: keyof typeof StitchModel = 'CHAIN';
    let repetitions = 1;

    $: if (scene) {
        group.clear();
        // Chain stitch as three cubic Beziers
        // Fairly innaccurate but has some of the geometry, at least
        const parts = makeMultiBezier(arrayToVector3List(StitchModel[whichModel].points));
        for (let i = 0; i < repetitions; ++i) {
            addStitch(parts, new THREE.Vector3(0, 0.5 * i, 0));
        }
        scene?.add(group);
    }

    function addStitch(
        parts: THREE.CubicBezierCurve3[],
        pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    ) {
        parts.map((curve) => {
            const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 10);
            const material = new THREE.MeshLambertMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.translateX(pos.x);
            mesh.translateY(pos.y);
            mesh.translateZ(pos.z);
            group.add(mesh);
        });
    }
</script>

<div id="wrapper">
    <ThreeCanvas bind:scene cameraPosition={new Vector3(0, 0, 3)} />
    <div id="input-wrapper">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
        <br />
        <label class="label">
            <span>Which model?</span>
            <select class="select" bind:value={whichModel}>
                {#each Object.keys(StitchModel) as key (key)}
                    <option value={key}>{key}</option>
                {/each}
            </select>
        </label>
        <label class="label">
            <span>Repetitions</span>
            <input class="input" type="number" bind:value={repetitions} />
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

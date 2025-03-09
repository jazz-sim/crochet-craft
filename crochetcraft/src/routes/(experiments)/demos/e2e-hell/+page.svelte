<script lang="ts">
    import { makeMultiBezier } from '$lib/builder/bezier';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import {
        Vector3,
        Scene,
        Mesh,
        MeshLambertMaterial,
        DoubleSide,
        Color,
        TubeGeometry,
        Group,
        Line,
        BufferGeometry,
        LineBasicMaterial,
    } from 'three';
    import { parse, link, place, elaborate, gdPlace } from 'crochet-stitcher';
    import { placeDebugSpheres } from '$lib/render/debug';
    import type { LinkedStitch, Pattern } from 'crochet-stitcher/types';
    import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

    // Example hard-coded chain stitch:
    const ChainStitchExampleParts = makeMultiBezier([
        new Vector3(0.0, 0.0, 0.0),
        new Vector3(0.03989, -0.1529, 0.4265),
        new Vector3(-0.1251, 0.1748, 0.4262),
        new Vector3(-0.286, 0.4362, -0.05045),
        new Vector3(-0.4751, 0.7433, -0.6106),
        new Vector3(-0.8814, 1.054, 0.3796),
        new Vector3(-0.1089, 1.246, 0.1362),
        new Vector3(0.6817, 1.442, -0.1128),
        new Vector3(-0.4605, 0.585, -0.5125),
        new Vector3(-0.01001, 0.4943, -0.007016),
    ]);

    function makeChainStitchExample(scene: Scene, pos: Vector3 = new Vector3(0, 0, 0)) {
        ChainStitchExampleParts.map((curve) => {
            const geometry = new TubeGeometry(curve, 50, 0.1, 10);
            // NOTE: May need to close TubeGeometries so that the stitch looks better...
            const material = new MeshLambertMaterial();
            material.side = DoubleSide; // NOTE: The side value of the material has to be double-sided for effective intersection checking.
            material.color = new Color().setHex(Math.random() * 0xffffff);
            material.emissive = material.color;
            const mesh = new Mesh(geometry, material);
            mesh.translateX(pos.x);
            mesh.translateY(pos.y);
            mesh.translateZ(pos.z);
            scene.add(mesh);
        });
    }
    // Actual processing for E2E happens in the Editor.svelte file
    // Hardcode test:
    /*  
        for (let i = 0; i < 10; ++i) {
            makeChainStitchExample(scene, new THREE.Vector3(0, 0.5 * i, 0));
        }
    */

    // Scene objects
    let scene: Scene;
    let mainGroup: Group = new Group();

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
        '30 ring': 'ch 30, sc 1',
        'increase test': 'ch 5, turn, sc 2, inc 1, sc 2',
        'decrease test': 'ch 7, turn, sc 2, dec 1, sc 2',
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
            const elaboratedMeshes = elaborate(placer(link(parse(currentSample))));
            // Before adding the meshes to the scene, merge each curve to comprise a stitch:
            const mergedMeshes = elaboratedMeshes.map((stitch) => {
                let stitchMeshMaterial = stitch[0].material as MeshLambertMaterial;
                let stitchGeometryCollection = stitch.map((mesh) => {
                    mesh.updateMatrix();
                    return mesh.geometry;
                });
                let singleGeometry = mergeGeometries(stitchGeometryCollection);
                return new Mesh(singleGeometry, stitchMeshMaterial);
            });
            mergedMeshes.forEach((mesh) => mainGroup.add(mesh));
        } else {
            const placedPoints = placer(link(parse(currentSample)));

            placeDebugSpheres(
                placedPoints.stitches.map(
                    (p) => new Vector3(p.position.x, p.position.y, p.position.z),
                ),
                mainGroup,
                0.5,
            );

            // Draw directions of stitches
            placedPoints.stitches.forEach((stitch) => {
                mainGroup.add(
                    new Line(
                        new BufferGeometry().setFromPoints([
                            stitch.position.clone(),
                            stitch.position
                                .clone()
                                .add(new Vector3(1, 0, 0).applyQuaternion(stitch.orientation)),
                        ]),
                        new LineBasicMaterial({ color: 0xffffff }),
                    ),
                );
            });
        }

        scene?.add(mainGroup);
    }
</script>

<div id="wrapper">
    <ThreeCanvas
        init={(s: Scene) => {
            scene = s;
        }}
    />

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

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
    import Panel from '$components/option-panel/Panel.svelte';

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
        'increase test': 'ch 6, turn, sc 5, ch 1, turn, sc 3, inc, sc 2',
        'decrease test': 'ch 7, turn, sc 2, dec 1, sc 2',
        circle: `\
1. MR, 6 sc
2. 6 inc
3. 6 (inc, 1 sc)
4. 1 sc, 5 (inc, 2 sc), inc, sc
5. 6 (inc, 3sc)
6. 3 sc, 5 (inc, 4 sc), inc, sc
7. 6 (inc, 5 sc)
8. 4 sc, 5 (inc, 6 sc), inc, 2 sc
9. 6 (inc, 7 sc)
10. 5 sc, 5 (inc, 8 sc), inc, 3 sc`,
        bowl: `\
1. MR, sc 6
2. inc 6
3. 6 (sc 1, inc 1)
4. 2 (sc 2, inc 1), sc 3, 3 (sc 2, inc 1)
5. sc 7, 2 (inc 1, sc 7)
6. sc 25
7. sc 25`,
        sphere: `\
1. MR, sc 6
2. inc 6
3. 6 (sc, inc)
4. sc 18
5. sc 18
6. sc 18
7. 6 (sc, dec)
8. 6 dec`,
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
            /*
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
            */
            elaboratedMeshes.forEach((a) => a.forEach((mesh) => mainGroup.add(mesh)));
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
                                .add(new Vector3(0, 1, 0).applyQuaternion(stitch.orientation)),
                        ]),
                        new LineBasicMaterial({ color: 0x00ff00 }),
                    ),
                );
                mainGroup.add(
                    new Line(
                        new BufferGeometry().setFromPoints([
                            stitch.position.clone(),
                            stitch.position
                                .clone()
                                .add(new Vector3(1, 0, 0).applyQuaternion(stitch.orientation)),
                        ]),
                        new LineBasicMaterial({ color: 0xff0000 }),
                    ),
                );
            });
        }

        scene?.add(mainGroup);
    }
</script>

<Panel title="E2E Testing - Options" position="docked">
    <a class="anchor" href={`/experiments`}>🛠️ Back To Experiments</a>
    <label class="label">
        <span><i>Placer algorithm:</i></span>
        <select class="select rounded-lg" bind:value={placerAlgorithm}>
            <option value="if">IF (Iterative Forces)</option>
            <option value="gd">GD (Gradient Descent)</option>
        </select>
    </label>

    <label class="label">
        <span><i>Maximum iterations for placer:</i> {placerMaxIterations}</span>
        <input
            class="rounded-lg"
            type="range"
            bind:value={placerMaxIterations}
            min={0}
            max={1000}
            step={1}
        />
    </label>

    <label class="label">
        <span><i>Test case:</i></span>
        <select class="select rounded-lg" bind:value={selectedSampleName}>
            {#each sampleNames as sampleStr}
                <option value={sampleStr}>{sampleStr}</option>
            {/each}
        </select>
    </label>
    <label>
        <input class="rounded-lg" type="checkbox" bind:checked={doElaboration} />
        <i>Do elaboration?</i>
    </label>
</Panel>
<ThreeCanvas
    --height="100%"
    init={(s: Scene) => {
        scene = s;
    }}
/>

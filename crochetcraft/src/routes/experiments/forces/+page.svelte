<script lang="ts">
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import {
        Scene,
        Vector3,
        Group,
        MeshLambertMaterial,
        SphereGeometry,
        Mesh,
        Line,
        BufferGeometry,
        LineBasicMaterial,
    } from 'three';
    import { evaluateForces } from 'crochet-stitcher';
    import Panel from '$components/option-panel/Panel.svelte';

    // Scene objects
    let scene: Scene;
    const group = new Group();
    const linkGroup = new Group();
    const pathGroup = new Group();

    // Settings for this demo
    let iterations = 1;
    let timeStep = 1;
    let iterNumber = 0;
    let showLinks = false;
    let showPaths = false;

    // List of setups for this demo
    type StitchSetup = {
        points: { x: number; y: number; z: number }[];
        radii: number[];
        links: number[][];
    };

    const sampleSetup: { [key: string]: StitchSetup } = {
        '2x2 Square': {
            points: [
                { x: 0, y: 0, z: 0 },
                { x: 10, y: 0, z: 0 },
                { x: 0, y: 10, z: 0 },
                { x: 10, y: 10, z: 0 },
            ],
            radii: [2.5, 1.5, 1.5, 0.5],
            links: [
                [1, 2],
                [0, 3],
                [0, 3],
                [1, 2],
            ],
        },
        '3x3 Uniform Square': {
            points: [
                { x: 0, y: 0, z: 0 },
                { x: 2, y: 0, z: 0 },
                { x: 4, y: 0, z: 0 },
                { x: 0, y: 2, z: 0 },
                { x: 2, y: 2, z: 0 },
                { x: 4, y: 2, z: 0 },
                { x: 0, y: 4, z: 0 },
                { x: 2, y: 4, z: 0 },
                { x: 4, y: 4, z: 0 },
            ],
            radii: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            links: [
                [1, 3],
                [0, 2, 4],
                [1, 5],
                [0, 4, 6],
                [1, 3, 5, 7],
                [2, 4, 8],
                [3, 7],
                [4, 6, 8],
                [5, 7],
            ],
        },
        'Nice Ring': {
            points: [
                { x: 10, y: 0, z: 0 },

                { x: 8.66, y: 5, z: 0 },
                { x: 7.07, y: 7.07, z: 0 },
                { x: 5, y: 8.66, z: 0 },

                { x: 0, y: 10, z: 0 },

                { x: -5, y: 8.66, z: 0 },
                { x: -7.07, y: 7.07, z: 0 },
                { x: -8.66, y: 5, z: 0 },

                { x: -10, y: 0, z: 0 },

                { x: -8.66, y: -5, z: 0 },
                { x: -7.07, y: -7.07, z: 0 },
                { x: -5, y: -8.66, z: 0 },

                { x: 0, y: -10, z: 0 },

                { x: 5, y: -8.66, z: 0 },
                { x: 7.07, y: -7.07, z: 0 },
                { x: 8.66, y: -5, z: 0 },
            ],
            radii: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            links: [
                [15, 1],
                [0, 2],
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
                [5, 7],
                [6, 8],
                [7, 9],
                [8, 10],
                [9, 11],
                [10, 12],
                [11, 13],
                [12, 14],
                [13, 15],
                [14, 0],
            ],
        },
        'Pessimistic Ring': {
            points: [
                { x: 0, y: 0, z: 0 },
                { x: 10, y: 0, z: 0 },
                { x: 20, y: 0, z: 0 },
                { x: 30, y: 0, z: 0 },
                { x: 0, y: 10, z: 0 },
                { x: 10, y: 10, z: 0 },
                { x: 20, y: 10, z: 0 },
                { x: 30, y: 10, z: 0 },
                { x: 0, y: 20, z: 0 },
                { x: 10, y: 20, z: 0 },
                { x: 20, y: 20, z: 0 },
                { x: 30, y: 20, z: 0 },
                { x: 0, y: 30, z: 0 },
                { x: 10, y: 30, z: 0 },
                { x: 20, y: 30, z: 0 },
                { x: 30, y: 30, z: 0 },
            ],
            radii: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            links: [
                [15, 1],
                [0, 2],
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
                [5, 7],
                [6, 8],
                [7, 9],
                [8, 10],
                [9, 11],
                [10, 12],
                [11, 13],
                [12, 14],
                [13, 15],
                [14, 0],
            ],
        },
        'Less Pessimistic Ring': {
            points: [
                { x: 0, y: 0, z: 0 },
                { x: 10, y: 0, z: 0 },
                { x: 20, y: 0, z: 0 },
                { x: 30, y: 0, z: 0 },

                { x: 20, y: 10, z: 0 },
                { x: 10, y: 10, z: 0 },
                { x: 0, y: 10, z: 0 },

                { x: 10, y: 20, z: 0 },
                { x: 20, y: 20, z: 0 },
                { x: 30, y: 20, z: 0 },

                { x: 30, y: 30, z: 0 },
                { x: 20, y: 30, z: 0 },
                { x: 10, y: 30, z: 0 },
                { x: 0, y: 30, z: 0 },

                { x: 30, y: 10, z: 0 },
                { x: 0, y: 20, z: 0 },
            ],
            radii: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            links: [
                [15, 1],
                [0, 2],
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 6],
                [5, 7],
                [6, 8],
                [7, 9],
                [8, 10],
                [9, 11],
                [10, 12],
                [11, 13],
                [12, 14],
                [13, 15],
                [14, 0],
            ],
        },
    };

    const sampleNames = Object.keys(sampleSetup);

    // Current sample and info
    let selectedSample = '2x2 Square';
    let currentSample = sampleSetup[selectedSample];
    let pointEvolutions: Vector3[][] = [];

    function buildSphere(pos: Vector3, radius: number) {
        const material = new MeshLambertMaterial();
        const sphere = new SphereGeometry(radius).translate(pos.x, pos.y, pos.z);
        const mesh = new Mesh(sphere, material);
        return mesh;
    }

    function buildLine(points: Vector3[], color: number = 0xffffff) {
        return new Line(
            new BufferGeometry().setFromPoints(points),
            new LineBasicMaterial({ color }),
        );
    }

    $: {
        currentSample = sampleSetup[selectedSample] as StitchSetup;
        pointEvolutions = [];
        for (let p = 0; p < currentSample.points.length; ++p) {
            pointEvolutions.push([]);
        }
        for (let p = 0; p < currentSample.points.length; ++p) {
            pointEvolutions[p].push(
                new Vector3(
                    currentSample.points[p].x,
                    currentSample.points[p].y,
                    currentSample.points[p].z,
                ),
            );
        }

        if (iterations >= 0 && iterNumber >= 0) {
            for (let i = 1; i <= iterations; ++i) {
                const lastSteps = pointEvolutions.map((pList) => pList[i - 1]);
                const nextStep = evaluateForces(
                    lastSteps,
                    currentSample.links,
                    currentSample.radii,
                    timeStep,
                );
                for (let p = 0; p < currentSample.points.length; ++p) {
                    pointEvolutions[p].push(nextStep[p]);
                }
            }
        }
    }

    // Inefficient. On change, removes all spheres and then adds them back to the scene
    $: {
        if (
            Number.isInteger(iterNumber) &&
            iterNumber >= 0 &&
            iterNumber < pointEvolutions[0].length
        ) {
            group.clear();
            pathGroup.clear();
            linkGroup.clear();

            for (let p = 0; p < currentSample.points.length; ++p) {
                group.add(buildSphere(pointEvolutions[p][iterNumber], currentSample.radii[p]));
            }

            if (showLinks) {
                for (let p = 0; p < currentSample.points.length; ++p) {
                    currentSample.links[p].forEach((link) =>
                        linkGroup.add(
                            buildLine(
                                [pointEvolutions[p][iterNumber], pointEvolutions[link][iterNumber]],
                                0xffff00,
                            ),
                        ),
                    );
                }
            }

            if (showPaths) {
                for (let p = 0; p < currentSample.points.length; ++p) {
                    pathGroup.add(buildLine(pointEvolutions[p].slice(0, iterNumber + 1)));
                }
            }
            scene?.add(group);
            scene?.add(linkGroup);
            scene?.add(pathGroup);
        }
    }
</script>

<Panel title="Iterative Forces Example - Options" position="docked">
    <a class="anchor" href={`/experiments`}>🛠️ Back To Experiments</a>
    <label class="label">
        <span><i>Demonstrations:</i></span>
        <select class="select rounded-lg" bind:value={selectedSample}>
            {#each sampleNames as sampleStr}
                <option value={sampleStr}>{sampleStr}</option>
            {/each}
        </select>
    </label>
    <label class="label">
        <span><i>Number of Iterations:</i></span>
        <input class="input rounded-lg" type="number" bind:value={iterations} />
    </label>
    <label class="label">
        <span><i>Iteration Number:</i></span>
        <input class="input rounded-lg" type="number" bind:value={iterNumber} max={iterations} />
    </label>
    <label class="label">
        <span><i>Timestep:</i></span>
        <input class="input rounded-lg" type="number" bind:value={timeStep} />
    </label>
    <label>
        <input class="rounded-lg" type="checkbox" bind:checked={showLinks} />
        <i>Show links between stitches?</i>
    </label>
    <label>
        <input class="rounded-lg" type="checkbox" bind:checked={showPaths} />
        <i>Show stitch paths through time? </i></label
    >
</Panel>
<ThreeCanvas
    --height="100%"
    init={(s: Scene) => {
        scene = s;
    }}
/>

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

    let doRotationJank = false;
    const ROTATION_JANK_EXPLANATION = `
Enables a bunch of extra math to try to align the stitch model to the x-axis for normalization. 
Ideally, this should do nothing to the stitch model, but while in development, this can help fix denormalized models.
Enabling this will also:
    - render a helper x-axis
    - render an unrotated copy of the stitch above the rotated one
    - print the rotated point set (which you can copy-paste to update the base model)
`;

    /**
     * Moves a set of points so the first point lies on the origin.
     * @param points
     */
    function moveToOrigin(points: THREE.Vector3[]) {
        const first = points[0];
        return points.map((p) => p.clone().sub(first));
    }

    const UP_SHIFT = new Vector3(0, 2, 0);

    // Target vector used by rotateToXAxis
    const TARGET_AXIS = new Vector3(1, 0, 0);
    // Minimum y/z component magnitude to be considered "close to zero"
    const EPSILON = 0.0001;

    /**
     * Rotates a set of points about the origin so the last point lies on the x-axis.
     *
     * Assumes the first point is at the origin.
     * @param points
     */
    function rotateToXAxis(points: THREE.Vector3[]) {
        const n = points.length;
        // The axis to rotate around is given by the cross produce of the vectors to
        // the end point and the x-axis point.
        // Visually, this is the normal to the plane formed by these two vectors.
        const source = points[n - 1].clone().sub(points[0]);

        // If already aligned to x-axis, stop
        if (Math.abs(source.y) < EPSILON && Math.abs(source.z) < EPSILON && source.x > 0) {
            return points;
        }

        const target = TARGET_AXIS.clone();
        const rotationAxis = new Vector3();
        rotationAxis.crossVectors(source, target).normalize();

        // Get the angle between our source and destination point using the dot product definition
        const theta = Math.acos(source.dot(target) / (source.length() * target.length()));

        // Log this info for fun
        console.log(`Rotation Axis: ${rotationAxis.toArray()}, Theta: ${theta}`);

        return points.map((p) => p.clone().applyAxisAngle(rotationAxis, theta));
    }

    $: if (scene) {
        group.clear();

        const points = arrayToVector3List(StitchModel[whichModel].points);

        const rotatedPoints = doRotationJank ? rotateToXAxis(moveToOrigin(points)) : points;

        const parts = makeMultiBezier(rotatedPoints);
        for (let i = 0; i < repetitions; ++i) {
            addStitch(parts, new THREE.Vector3(0.5 * i, 0, 0));
        }

        if (doRotationJank) {
            console.log(rotatedPoints);

            // Show X-axis
            const xAxis = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new Vector3(0, 0, 0),
                    new Vector3(10, 0, 0),
                ]),
                new THREE.MeshLambertMaterial(),
            );
            group.add(xAxis);
            addStitch(makeMultiBezier(points), UP_SHIFT);
        }

        scene?.add(group);
    }

    function addStitch(
        parts: THREE.CubicBezierCurve3[],
        pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    ) {
        const partLengthP1 = parts.length + 1;

        parts.map((curve, index) => {
            const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 10);
            const material = new THREE.MeshLambertMaterial({
                color: new THREE.Color(
                    0.2 + (0.8 * (index + 1)) / partLengthP1,
                    0.0,
                    0.2 + (0.8 * (index + 1)) / partLengthP1,
                ),
            });
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
        <label class="label">
            <span title={ROTATION_JANK_EXPLANATION}>Do rotation jank?</span>
            <input type="checkbox" bind:checked={doRotationJank} />
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

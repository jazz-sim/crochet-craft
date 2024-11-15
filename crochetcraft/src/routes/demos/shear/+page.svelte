<script lang="ts">
    import { placeDebugSpheres } from '$lib/render/debug';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

    type Mat2 = {
        xx: number;
        xy: number;
        yx: number;
        yy: number;
    };

    let scene: THREE.Scene;

    let group: THREE.Group = new THREE.Group();
    let mat1 = {
        xx: 1,
        xy: 0,
        yx: 0,
        yy: 1,
    };
    let mat2 = {
        xx: 1,
        xy: 0,
        yx: 0,
        yy: 1,
    };
    let displayMode: number = 0;

    // This just does a matrix-vector product, but ignores the z dimension entirely.
    // Imagine the matrix is actually a 3d one where the third row and column are zeros,
    // except for the bottom right which is unity.
    function transform(mat: Mat2, point: Vector3) {
        return new Vector3(
            point.x * mat.xx + point.y * mat.xy,
            point.x * mat.yx + point.y * mat.yy,
            point.z,
        );
    }

    // Linear interpolates frmo a to b, given t in [0, 1]
    // a is preferred for low values of t, b is preferred for high values
    function lerp(a: number, b: number, t: number) {
        return a + t * (b - a);
    }

    // Create the base points in the xy plane
    // at unit distances apart from each other
    // in a 20x20 grid centered on the origin.
    const basePoints: Vector3[] = [];
    for (let y = -10; y <= 10; ++y) {
        for (let x = -10; x <= 10; ++x) {
            basePoints.push(new Vector3(x, y, 0));
        }
    }

    function display() {
        if (displayMode == 1) {
            // Use only matrix 2 for transformation
            return basePoints.map((p) => transform(mat2, p));
        } else if (displayMode == 2) {
            // Do a cursed linear interpolation between the two shear matrices.
            // I have some intuition on why we interpolate based on y for the x coordinate and vice versa but
            // I lack the functions to explain this.
            // The (variable + 10)/20 scales the interpolation value t to [0, 1]
            // since points are placed from [-20, 20] in both dimensions.
            return basePoints.map(
                (p) =>
                    new Vector3(
                        lerp(transform(mat1, p).x, transform(mat2, p).x, (p.y + 10) / 20),
                        lerp(transform(mat1, p).y, transform(mat2, p).y, (p.x + 10) / 20),
                        0,
                    ),
            );
        }
        // Use only matrix 1 for transformation
        return basePoints.map((p) => transform(mat1, p));
    }

    // Depending on display mode, render points with different shears applied
    $: if ((mat1, mat2, displayMode) || true) {
        console.log();
        group.clear();
        const points = display();
        placeDebugSpheres(points, group);
        scene?.add(group);
    }
</script>

<div id="wrapper">
    <ThreeCanvas
        bind:scene
        init={(scene) => {
            // Create x axis in xy plane
            scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([
                        new Vector3(-30, 0, 0),
                        new Vector3(30, 0, 0),
                    ]),
                    new THREE.LineBasicMaterial(),
                ),
            );
            // Create y axis in xy plane
            scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([
                        new Vector3(0, -30, 0),
                        new Vector3(0, 30, 0),
                    ]),
                    new THREE.LineBasicMaterial(),
                ),
            );
        }}
    />

    <div id="input-wrapper">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
        <br /><br />
        <p>
            Display mode input - 0 to only use mat1, 1 to only use mat2, and 2 to interpolate
            between the two.
        </p>
        <br />
        <input class="input" type="number" bind:value={displayMode} />
        <br />
        <br />
        mat1
        <br />
        <table>
            <tr>
                <td>{mat1.xx}</td>
                <td><input class="input" type="number" bind:value={mat1.xy} /></td>
            </tr>
            <tr>
                <td><input class="input" type="number" bind:value={mat1.yx} /></td>
                <td>{mat1.yy}</td>
            </tr>
        </table>
        <br />
        <br />
        mat2
        <br />
        <table>
            <tr>
                <td>{mat2.xx}</td>
                <td><input class="input" type="number" bind:value={mat2.xy} /></td>
            </tr>
            <tr>
                <td><input class="input" type="number" bind:value={mat2.yx} /></td>
                <td>{mat2.yy}</td>
            </tr>
        </table>
    </div>
</div>

<style>
    #wrapper {
        display: flex;
    }

    #input-wrapper {
        padding: 0.5em;
        width: 250px;
        flex: 0 0;
    }
</style>

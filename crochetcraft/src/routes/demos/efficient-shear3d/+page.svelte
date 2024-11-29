<script lang="ts">
    import {
        efficientPlaceDebugSpheres,
        placeDebugSpheres,
        updateDebugSpheres,
    } from '$lib/render/debug';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

    type Mat3 = [[number, number, number], [number, number, number], [number, number, number]];

    let scene: THREE.Scene;

    let group: THREE.Group = new THREE.Group();
    let mat1 = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ] as Mat3;
    let mat2 = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ] as Mat3;
    let displayMode: number = 0;

    // This just does a matrix-vector product, but ignores the z dimension entirely.
    // Imagine the matrix is actually a 3d one where the third row and column are zeros,
    // except for the bottom right which is unity.
    // Top right is how much the x coordinate moves proportional to the y coordinate
    // bottom left is how much the y coordinate moves proportional to the x coordinate
    function transform(mat: Mat3, point: Vector3) {
        return new Vector3(
            point.x * mat[0][0] + point.y * mat[0][1] + point.z * mat[0][2],
            point.x * mat[1][0] + point.y * mat[1][1] + point.z * mat[1][2],
            point.z * mat[2][0] + point.y * mat[2][1] + point.z * mat[2][2],
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
    for (let z = -50; z <= 50; ++z) {
        for (let y = -10; y <= 10; ++y) {
            for (let x = -10; x <= 10; ++x) {
                basePoints.push(new Vector3(x, y, z));
            }
        }
    }

    // place the initial spheres
    const instancedMesh = efficientPlaceDebugSpheres(basePoints, group);

    function display() {
        if (displayMode == 1) {
            // Use only matrix 2 for transformation
            return basePoints.map((p) => transform(mat2, p));
        } else if (displayMode == 2) {
            // Do a cursed linear interpolation between the two shear matrices.
            // I also have no proof of correctness for this.
            // The (variable + 10)/20 scales the interpolation value t to [0, 1]
            // this makes sense if variable is from [-10, 10]

            // since points are placed from [-20, 20] in both dimensions.
            return basePoints.map(
                (p) =>
                    new Vector3(
                        lerp(transform(mat1, p).x, transform(mat2, p).x, (p.y + p.z + 20) / 40),
                        lerp(transform(mat1, p).y, transform(mat2, p).y, (p.x + p.z + 20) / 40),
                        lerp(transform(mat1, p).z, transform(mat2, p).z, (p.x + p.y + 20) / 40),
                    ),
            );
        }
        // Use only matrix 1 for transformation
        return basePoints.map((p) => transform(mat1, p));
    }

    // Depending on display mode, render points with different shears applied
    $: if ((mat1, mat2, displayMode) || true) {
        console.log();
        const points = display();
        updateDebugSpheres(instancedMesh, points); // update the sphere positions
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
                    new THREE.LineBasicMaterial({ color: 0xff0000 }),
                ),
            );
            // Create y axis in xy plane
            scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([
                        new Vector3(0, -30, 0),
                        new Vector3(0, 30, 0),
                    ]),
                    new THREE.LineBasicMaterial({ color: 0x00ff00 }),
                ),
            );
            // Create z axis in xy plane
            scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([
                        new Vector3(0, 0, -30),
                        new Vector3(0, 0, 30),
                    ]),
                    new THREE.LineBasicMaterial({ color: 0x0000ff }),
                ),
            );
        }}
    />

    <div id="input-wrapper">
        <p>Efficient rendering of 3d shear with 40,000 points</p>
        Display mode input - 0 to only use mat1, 1 to only use mat2, and 2 to interpolate between the
        two.
        <br />
        <input type="number" bind:value={displayMode} />
        <br />
        <br />
        mat1
        <br />
        <table>
            <tbody>
                <tr>
                    <td>{mat1[0][0]}</td>
                    <td><input type="number" bind:value={mat1[0][1]} /></td>
                    <td><input type="number" bind:value={mat1[0][2]} /></td>
                </tr>
                <tr>
                    <td><input type="number" bind:value={mat1[1][0]} /></td>
                    <td>{mat1[1][1]}</td>
                    <td><input type="number" bind:value={mat1[1][2]} /></td>
                </tr>
                <tr>
                    <td><input type="number" bind:value={mat1[2][0]} /></td>
                    <td><input type="number" bind:value={mat1[2][1]} /></td>
                    <td>{mat1[2][2]}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <br />
        mat2
        <br />
        <table>
            <tbody>
                <tr style="width: 200px;">
                    <td>{mat2[0][0]}</td>
                    <td><input type="number" bind:value={mat2[0][1]} /></td>
                    <td><input type="number" bind:value={mat2[0][2]} /></td>
                </tr>
                <tr>
                    <td><input type="number" bind:value={mat2[1][0]} /></td>
                    <td>{mat2[1][1]}</td>
                    <td><input type="number" bind:value={mat2[1][2]} /></td>
                </tr>
                <tr>
                    <td><input type="number" bind:value={mat2[2][0]} /></td>
                    <td><input type="number" bind:value={mat2[2][1]} /></td>
                    <td>{mat2[2][2]}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<style>
    td {
        width: 10px;
    }
    table {
        width: 100%;
    }
    #wrapper {
        display: flex;
    }

    #input-wrapper {
        padding: 0.5em;
        width: 500px;
        flex: 0 0;
    }
</style>

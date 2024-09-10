<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    import '../../../styles/global.css';

    let canvasBinding: Element;

    let points: Vector3[] = [new Vector3(0, 0, 0)];
    let group = new THREE.Group();
    const scene = new THREE.Scene();
    scene.add(group);

    onMount(() => {
        const width = window.innerWidth > 300 ? window.innerWidth - 250 : window.innerWidth,
            height = window.innerHeight;

        // init: camera, scene, geometries, renderer, and controls
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);

        const light = new THREE.AmbientLight(0x404040, 10); // soft white light
        scene.add(light);
        scene.add(new THREE.DirectionalLight(0x404040, 10)); // make spheres look less flat

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasBinding });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 60);
        controls.update(); // Must be called after manually updating camera position

        // animation
        function animation() {
            renderer.render(scene, camera);
        }
    });

    // Inefficient. On change, kill everything and revive it all.
    $: {
        group.clear();
        points.forEach((p) => {
            const point = new THREE.SphereGeometry(0.5).translate(p.x, p.y, p.z);
            const material = new THREE.MeshLambertMaterial();
            const mesh = new THREE.Mesh(point, material);
            group.add(mesh);
        });
        scene.add(group);
    }
</script>

<div id="wrapper">
    <canvas bind:this={canvasBinding}></canvas>
    <div id="input-wrapper">
        <p>
            Enter points below. Coordinates can be freely edited. Add a point using the + cell, and
            delete points using the - cell.
        </p>
        <table id="points-table">
            <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                    <th rowspan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each points as point, index}
                    <tr>
                        <td>
                            <input
                                type="number"
                                value={point.x}
                                on:change={(e) => {
                                    const newPoint = new Vector3(
                                        e.currentTarget.valueAsNumber,
                                        point.y,
                                        point.z,
                                    );
                                    points = [
                                        ...points.slice(0, index),
                                        newPoint,
                                        ...points.slice(index + 1),
                                    ];
                                }}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={point.y}
                                on:change={(e) => {
                                    const newPoint = new Vector3(
                                        point.x,
                                        e.currentTarget.valueAsNumber,
                                        point.z,
                                    );
                                    points = [
                                        ...points.slice(0, index),
                                        newPoint,
                                        ...points.slice(index + 1),
                                    ];
                                }}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={point.z}
                                on:change={(e) => {
                                    const newPoint = new Vector3(
                                        point.x,
                                        point.y,
                                        e.currentTarget.valueAsNumber,
                                    );
                                    points = [
                                        ...points.slice(0, index),
                                        newPoint,
                                        ...points.slice(index + 1),
                                    ];
                                }}
                            />
                        </td>
                        <td
                            ><button
                                on:click={() => {
                                    points = [
                                        ...points.slice(0, index),
                                        new Vector3(point.x, point.y, point.z),
                                        ...points.slice(index),
                                    ];
                                }}>+</button
                            ></td
                        >
                        <td
                            ><button
                                on:click={() => {
                                    points = [
                                        ...points.slice(0, index),
                                        ...points.slice(index + 1),
                                    ];
                                }}>-</button
                            ></td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>

        <p>Extra button to add a point to the start of the list.</p>
        <button
            on:click={() => {
                points = [new Vector3(0, 0, 0), ...points];
            }}>Add point to start</button
        >
    </div>
</div>

<style>
    #wrapper {
        display: flex;
    }

    #input-wrapper {
        padding: 0.5em;
    }

    #points-table {
        border: 1px solid black;
        border-collapse: collapse;
    }

    #points-table td {
        border: 1px solid black;
        min-width: 2em;
    }
    #points-table td input {
        border: none;
        box-sizing: border-box;
        display: relative;
        width: 100%;
    }
</style>

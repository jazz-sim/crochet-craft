<script lang="ts">
    import { page } from '$app/stores';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import { placeDebugSpheres } from '$lib/render/debug';
    import PointsTable from '$components/PointsTable.svelte';
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

    let scene: THREE.Scene;

    let points: Vector3[] = [new Vector3(0, 0, 0)];

    const group = new THREE.Group();
    let quicklink = '';

    onMount(() => {
        const path = new URLSearchParams(window.location.search).get('p');

        if (path) {
            try {
                console.log(decodeURI(path));
                console.log(JSON.parse(decodeURI(path)));

                points = JSON.parse(decodeURI(path)).map(
                    (p: { x: number; y: number; z: number }) => new Vector3(p.x, p.y, p.z),
                );
            } catch {
                console.error("Invalid search params, 'points' will just contain the origin.");
            }
        }
    });

    // Inefficient. On change, removes all spheres and then adds them back to the scene
    $: {
        group.clear();
        placeDebugSpheres(points, group);
        scene?.add(group);

        $page.url.searchParams.set('p', encodeURI(JSON.stringify(points)));
        quicklink = $page.url.toString();
    }
</script>

<div id="wrapper">
    <ThreeCanvas bind:scene />

    <div id="input-wrapper">
        <a href={quicklink}>Quick link to this set of points</a>
        <br />
        <p>
            Enter points below. Coordinates can be freely edited. Add a point using the + cell, and
            delete points using the - cell.
        </p>
        <PointsTable bind:points />
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

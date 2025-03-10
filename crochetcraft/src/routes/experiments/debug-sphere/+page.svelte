<script lang="ts">
    import { page } from '$app/stores';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import { placeDebugSpheres } from '$lib/render/debug';
    import PointsTable from '$components/points-table/PointsTable.svelte';
    import { onMount } from 'svelte';
    import { Vector3, Scene, Group } from 'three';
    import Panel from '$components/option-panel/Panel.svelte';

    let scene: Scene;

    let points: Vector3[] = [new Vector3(0, 0, 0)];

    const group = new Group();
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

    // Inefficient. On change, removes all spheres and then adds them back to the scene:
    $: {
        group.clear();
        placeDebugSpheres(points, group);
        scene?.add(group);

        $page.url.searchParams.set('p', encodeURI(JSON.stringify(points)));
        quicklink = $page.url.toString();
    }
</script>

<Panel title="Debug Spheres - Options" position="docked">
    <a class="anchor" href={`/experiments`}>🛠️ Back To Experiments</a>
    <br />
    <a class="anchor" href={quicklink}>🔗 Link to point set</a>
    <p>
        Enter points below. Coordinates can be freely edited. Add a point using the + cell, and
        delete points using the - cell.
    </p>
    <PointsTable bind:points />
</Panel>
<ThreeCanvas
    --height="100%"
    init={(s: Scene) => {
        scene = s;
    }}
/>

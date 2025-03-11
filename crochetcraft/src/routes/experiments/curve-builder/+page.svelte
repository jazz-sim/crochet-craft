<script lang="ts">
    import { page } from '$app/stores';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import PointsTable from '$components/points-table/PointsTable.svelte';
    import { onMount } from 'svelte';
    import {
        Vector3,
        Scene,
        Group,
        Curve,
        CurvePath,
        LineCurve3,
        Object3D,
        Line,
        BufferGeometry,
        TubeGeometry,
        Mesh,
        MeshBasicMaterial,
        MeshLambertMaterial,
        DirectionalLight,
    } from 'three';
    import { CubicSpline3D } from '$lib/geometry/cubicSpline';
    import { placeDebugSpheres } from '$lib/render/debug';
    import { vectorListToCode } from '$lib/builder/codegen';
    import Panel from '$components/option-panel/Panel.svelte';

    enum DrawType {
        Point = 'Point',
        Line = 'Line',
        Cylinder = 'Cylinder',
    }

    enum InterpolationMode {
        Linear = 'Linear',
        // I have no idea how to implement this one
        // Bezier = 'Bezier',
        CubicSpline = 'CubicSpline',
    }

    let scene: Scene;
    let points: Vector3[] = $state([new Vector3(0, 0, 0), new Vector3(1, 1, 1)]);
    let drawType = $state(DrawType.Point);
    let interpolationMode = $state(InterpolationMode.Linear);
    let interpolationSamples = $state(10);
    let duplicates = $state(0);
    let quicklink = $state('');

    const superGroup = new Group();

    function getCurve(): Curve<Vector3> {
        switch (interpolationMode) {
            case InterpolationMode.Linear:
                const path = new CurvePath<Vector3>();
                for (let i = 1; i < points.length; ++i) {
                    path.add(new LineCurve3(points[i - 1], points[i]));
                }
                return path;
            case InterpolationMode.CubicSpline:
                return new CubicSpline3D(points);
        }
    }

    function drawCurve(path: Curve<Vector3>): Object3D {
        switch (drawType) {
            case DrawType.Point:
                const subGroup = new Group();
                placeDebugSpheres(path.getPoints(interpolationSamples), subGroup);
                return subGroup;
            case DrawType.Line:
                return new Line(
                    new BufferGeometry().setFromPoints(path.getPoints(interpolationSamples)),
                    new MeshBasicMaterial(),
                );
            case DrawType.Cylinder:
                return new Mesh(
                    new TubeGeometry(path, interpolationSamples, 0.5, 8),
                    new MeshLambertMaterial(),
                );
        }
    }
    onMount(() => {
        const path = new URLSearchParams(window.location.search).get('p');
        if (path) {
            try {
                points = JSON.parse(decodeURI(path)).map(
                    (p: { x: number; y: number; z: number }) => new Vector3(p.x, p.y, p.z),
                );
            } catch {
                console.error("Invalid search params, 'points' will just contain defaults.");
            }
        }

        // add static, angled directional light
        const lightB = new DirectionalLight(0x000020, 100);
        scene.add(lightB);
        lightB.target = new Object3D().translateX(10).translateY(5).translateZ(2);
        scene.add(lightB.target);

        const lightR = new DirectionalLight(0x200000, 100);
        scene.add(lightR);
        lightR.target = new Object3D().translateX(-10).translateY(-5).translateZ(-2);
        scene.add(lightR.target);
    });

    $effect(() => {
        superGroup.clear();
        const baseGroup = new Group();
        if (points.length > 1) {
            const path = getCurve();
            const shape = drawCurve(path);
            baseGroup.add(shape);
        }
        if (duplicates > 0 && points.length > 1) {
            const diff = new Vector3(
                points[points.length - 1].x - points[0].x,
                points[points.length - 1].y - points[0].y,
                points[points.length - 1].z - points[0].z,
            );
            for (let i = 1; i <= duplicates; ++i) {
                const left = baseGroup.clone(true);
                const right = baseGroup.clone(true);
                left.translateX(diff.x * i);
                left.translateY(diff.y * i);
                left.translateZ(diff.z * i);
                right.translateX(-diff.x * i);
                right.translateY(-diff.y * i);
                right.translateZ(-diff.z * i);
                superGroup.add(left);
                superGroup.add(right);
            }
        }
        superGroup.add(baseGroup);
        scene?.add(superGroup);

        $page.url.searchParams.set('p', encodeURI(JSON.stringify(points)));
        quicklink = $page.url.toString();
    });
</script>

<Panel title="Curve Builder - Options" position="docked">
    <a class="anchor" href={`/experiments`}>🛠️ Back To Experiments</a>
    <br />
    <a class="anchor" href={quicklink}>🔗 Link to point set</a>
    <label class="label">
        <span><i>Item type:</i></span>
        <select class="select rounded-lg" bind:value={drawType}>
            {#each Object.values(DrawType) as drawType}
                <option value={drawType}>{drawType}</option>
            {/each}
        </select></label
    >
    <label class="label">
        <span><i>Function type:</i></span>
        <select class="select rounded-lg" bind:value={interpolationMode}>
            {#each Object.values(InterpolationMode) as interpolationMode}
                <option value={interpolationMode}>{interpolationMode}</option>
            {/each}
        </select>
    </label>

    <label class="label">
        <span><i>Interpolation Count:</i></span>
        <input class="input rounded-lg" type="number" bind:value={interpolationSamples} />
    </label>
    <label class="label">
        <span><i>Duplicates:</i></span>
        <input class="input rounded-lg" type="number" bind:value={duplicates} />
    </label>
    <button
        class="variant-filled-primary btn rounded-lg"
        onclick={() => {
            console.log(points);
        }}>Print: points to console</button
    >
    <button
        class="variant-filled-primary btn rounded-lg"
        onclick={() => {
            console.log(vectorListToCode(points));
        }}>Print: builder code to console</button
    >
    <PointsTable bind:points />
</Panel>
<ThreeCanvas
    --height="100%"
    init={(s: Scene) => {
        scene = s;
    }}
/>

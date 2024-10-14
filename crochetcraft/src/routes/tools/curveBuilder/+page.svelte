<script lang="ts">
    import { page } from '$app/stores';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import PointsTable from '$components/PointsTable.svelte';
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { CubicSpline3D } from '$lib/geometry/cubicSpline';
    import { placeDebugSpheres } from '$lib/render/debug';
    import { vectorListToCode } from '$lib/builder/codegen';

    function enumToKeys(type: object) {
        return Object.values(type).filter((x) => !isNaN(x as number));
    }

    enum DrawType {
        Point,
        Line,
        Cylinder,
    }
    const drawTypeOptions = enumToKeys(DrawType);

    enum InterpolationMode {
        Linear,
        // I have no idea how to implement this one
        // Bezier,
        CubicSpline,
    }
    const interpolationOptions = enumToKeys(InterpolationMode);

    type EditorSettings = {
        drawType: DrawType;
        interpolationMode: InterpolationMode;
        interpolationSamples: number;
        duplicates: number;
    };

    let scene: THREE.Scene;
    let points: Vector3[] = [new Vector3(0, 0, 0), new Vector3(1, 1, 1)];
    let editorSettings: EditorSettings = {
        drawType: DrawType.Point,
        interpolationMode: InterpolationMode.Linear,
        interpolationSamples: 10,
        duplicates: 0,
    };
    let quicklink = '';

    const superGroup = new THREE.Group();

    function getCurve(): THREE.Curve<Vector3> {
        switch (editorSettings.interpolationMode) {
            case InterpolationMode.Linear:
                const path = new THREE.CurvePath<Vector3>();
                for (let i = 1; i < points.length; ++i) {
                    path.add(new THREE.LineCurve3(points[i - 1], points[i]));
                }
                return path;
            case InterpolationMode.CubicSpline:
                return new CubicSpline3D(points);
        }
    }

    function drawCurve(path: THREE.Curve<Vector3>): THREE.Object3D {
        switch (editorSettings.drawType) {
            case DrawType.Point:
                const subGroup = new THREE.Group();
                placeDebugSpheres(path.getPoints(editorSettings.interpolationSamples), subGroup);
                return subGroup;
            case DrawType.Line:
                return new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        path.getPoints(editorSettings.interpolationSamples),
                    ),
                    new THREE.MeshBasicMaterial(),
                );
            case DrawType.Cylinder:
                return new THREE.Mesh(
                    new THREE.TubeGeometry(path, editorSettings.interpolationSamples, 0.5, 8),
                    new THREE.MeshLambertMaterial(),
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
        const lightB = new THREE.DirectionalLight(0x000020, 100);
        scene.add(lightB);
        lightB.target = new THREE.Object3D().translateX(10).translateY(5).translateZ(2);
        scene.add(lightB.target);

        const lightR = new THREE.DirectionalLight(0x200000, 100);
        scene.add(lightR);
        lightR.target = new THREE.Object3D().translateX(-10).translateY(-5).translateZ(-2);
        scene.add(lightR.target);
    });

    $: {
        superGroup.clear();
        const baseGroup = new THREE.Group();
        if (points.length > 1) {
            const path = getCurve();
            const shape = drawCurve(path);
            baseGroup.add(shape);
        }
        if (editorSettings.duplicates > 0 && points.length > 1) {
            const diff = new Vector3(
                points[points.length - 1].x - points[0].x,
                points[points.length - 1].y - points[0].y,
                points[points.length - 1].z - points[0].z,
            );
            for (let i = 1; i <= editorSettings.duplicates; ++i) {
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
    }
</script>

<div id="wrapper">
    <ThreeCanvas bind:scene />

    <div id="input-wrapper">
        <a href={quicklink}>Quick link to this set of points</a>
        <br /><br />
        <h2>Options</h2>
        <select bind:value={editorSettings.drawType}>
            {#each drawTypeOptions as drawType}
                <option value={drawType}>{DrawType[drawType]}</option>
            {/each}
        </select>
        <br /><br />
        <select bind:value={editorSettings.interpolationMode}>
            {#each interpolationOptions as interpolationMode}
                <option value={interpolationMode}>{InterpolationMode[interpolationMode]}</option>
            {/each}
        </select>
        <br /><br />
        <label>
            Interpolation Count
            <input type="number" bind:value={editorSettings.interpolationSamples} />
        </label>
        <br /><br />
        <label>
            Duplicates
            <input type="number" bind:value={editorSettings.duplicates} />
        </label>
        <br /><br />
        <button
            class="btn variant-filled-primary"
            on:click={() => {
                console.log(points);
            }}>Print points to console.</button
        >
        <button
            class="btn variant-filled-primary"
            on:click={() => {
                console.log(vectorListToCode(points));
            }}>Print builder code to console.</button
        >
        <br /><br />
        <PointsTable bind:points />
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
    }
</style>

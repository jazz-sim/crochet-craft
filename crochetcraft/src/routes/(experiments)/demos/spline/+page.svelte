<script lang="ts">
    import { CubicInterpolator } from '$lib/geometry/cubicSpline';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

    const base = [0, 2, 3, -2, 4];
    const points = new CubicInterpolator(base).sample(50).map((y, idx) => new Vector3(idx, y, 0));
</script>

<ThreeCanvas
    init={(scene) => {
        points.forEach((p) => {
            const point = new THREE.SphereGeometry(0.2).translate(p.x - 25, p.y * 10, p.z);
            const material = new THREE.MeshLambertMaterial();
            const mesh = new THREE.Mesh(point, material);
            scene.add(mesh);
        });
        base.forEach((y, idx) => {
            const point = new THREE.SphereGeometry(0.5).translate(idx * 10 - 25, y * 10, 0);
            const material = new THREE.MeshLambertMaterial();
            const mesh = new THREE.Mesh(point, material);
            scene.add(mesh);
        });
    }}
/>

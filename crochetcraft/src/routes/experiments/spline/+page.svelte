<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
    import { CubicInterpolator } from '$lib/geometry/cubicSpline';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import { Vector3, Mesh, MeshLambertMaterial, SphereGeometry, Scene } from 'three';

    let scene: Scene;
    const base = [0, 2, 3, -2, 4];
    const points = new CubicInterpolator(base).sample(50).map((y, idx) => new Vector3(idx, y, 0));
</script>

<Panel title="Cubic Spline Example" position="left">
    <a class="anchor" href={`/experiments`}>🛠️ Back To Experiments</a>
</Panel>
<ThreeCanvas
    --height="100%"
    init={(s: Scene) => {
        scene = s;
        points.forEach((p) => {
            const point = new SphereGeometry(0.2).translate(p.x - 25, p.y * 10, p.z);
            const material = new MeshLambertMaterial();
            const mesh = new Mesh(point, material);
            scene.add(mesh);
        });
        base.forEach((y, idx) => {
            const point = new SphereGeometry(0.5).translate(idx * 10 - 25, y * 10, 0);
            const material = new MeshLambertMaterial();
            const mesh = new Mesh(point, material);
            scene.add(mesh);
        });
    }}
/>

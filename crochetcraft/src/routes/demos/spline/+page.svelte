<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    import '../../../styles/global.css';
    import { CubicInterpolator } from '$lib/geometry/cubicSpline';

    let canvasBinding: Element;

    const base = [0, 2, 3, -2, 4];
    const points = new CubicInterpolator(base).sample(50).map((y, idx) => new Vector3(idx, y, 0));

    onMount(() => {
        const width = window.innerWidth,
            height = window.innerHeight;

        // init: camera, scene, geometries, renderer, and controls
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);

        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0x404040, 10); // soft white light
        scene.add(light);
        scene.add(new THREE.DirectionalLight(0x404040, 10));

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

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasBinding });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 60);
        controls.update(); // Must be called after manually updating camera position

        // animation
        function animation() {
            renderer.render(scene, camera);
        }
    });
</script>

<canvas bind:this={canvasBinding}></canvas>

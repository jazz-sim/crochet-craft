<script lang="ts">
    // Wrapping the demo three.js code in an onMount to avoid making any other changes
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    onMount(() => {
        const width = window.innerWidth,
            height = window.innerHeight;

        // init

        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
        camera.position.z = 1;

        const scene = new THREE.Scene();

        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);
        document.body.appendChild(renderer.domElement);

        // animation

        function animation(time: number) {
            mesh.rotation.x = time / 2000;
            mesh.rotation.y = time / 1000;

            renderer.render(scene, camera);
        }
    });
</script>

<h1>Three.js Testing</h1>

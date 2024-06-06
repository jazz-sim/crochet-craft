<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    import '../../../styles/global.css';

    let canvasBinding: Element;

    // NURBS curve, Three.js can't really do this one
    /* 
    const ChainStitch = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.010005, -0.631802, 0.007015),
        new THREE.Vector3(0.005971, -0.808781, 0.263553),
        new THREE.Vector3(-0.019027, -0.19898, 0.5),
        new THREE.Vector3(-0.592463, -0.255669, -0.823533),
        new THREE.Vector3(-0.665725, 0.516447, 0.484824),
        new THREE.Vector3(0.482434, 0.829596, 0.012919),
        new THREE.Vector3(0, 0.178684, -0.4),
        new THREE.Vector3(0, -0.137477, 0),
    ]);
    */

    // Chain stitch as three cubic Beziers
    // Fairly innaccurate but has some of the geometry, at least
    const ChainStitchParts = [
        new THREE.CubicBezierCurve3(
            new THREE.Vector3(1.95516, -0.674047, -0.315564),
            new THREE.Vector3(1.99505, -0.826905, 0.110903),
            new THREE.Vector3(1.83008, -0.499248, 0.110673),
            new THREE.Vector3(1.66917, -0.237861, -0.366016),
        ),
        new THREE.CubicBezierCurve3(
            new THREE.Vector3(1.66917, -0.237861, -0.366016),
            new THREE.Vector3(1.48009, 0.06927, -0.926126),
            new THREE.Vector3(1.07377, 0.380176, 0.063998),
            new THREE.Vector3(1.84627, 0.5717, -0.179318),
        ),
        new THREE.CubicBezierCurve3(
            new THREE.Vector3(1.84627, 0.5717, -0.179318),
            new THREE.Vector3(2.63683, 0.767703, -0.428325),
            new THREE.Vector3(1.4947, -0.089052, -0.8281),
            new THREE.Vector3(1.94515, -0.179722, -0.32258),
        ),
    ];

    function makeChainStitch(scene: THREE.Scene, pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        ChainStitchParts.map((curve) => {
            const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 10);
            const material = new THREE.MeshLambertMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.translateX(pos.x);
            mesh.translateY(pos.y);
            mesh.translateZ(pos.z);
            scene.add(mesh);
        });
    }

    onMount(() => {
        const width = window.innerWidth,
            height = window.innerHeight;

        // init: camera, scene, geometries, renderer, and controls
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);

        const scene = new THREE.Scene();
        const light = new THREE.AmbientLight(0x404040, 10); // soft white light
        scene.add(light);
        scene.add(new THREE.DirectionalLight(0x404040, 10));

        // Default cube with colour
        for (let i = 0; i < 10; ++i) {
            makeChainStitch(scene, new THREE.Vector3(0, 0.5 * i, 0));
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasBinding });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 3);
        controls.update(); // Must be called after manually updating camera position

        // animation
        function animation() {
            renderer.render(scene, camera);
        }
    });
</script>

<canvas bind:this={canvasBinding}></canvas>

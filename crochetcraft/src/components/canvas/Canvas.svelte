<script lang="ts">
    // FIRST - RENDER AFTER PIPELINE IS DONE
    import { makeMultiBezier } from '$lib/builder/bezier';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { previewCanvasScene } from '../main-ui/stores';
    const ChainStitchParts = makeMultiBezier([
        new THREE.Vector3(0.0, 0.0, 0.0),
        new THREE.Vector3(0.03989, -0.1529, 0.4265),
        new THREE.Vector3(-0.1251, 0.1748, 0.4262),
        new THREE.Vector3(-0.286, 0.4362, -0.05045),
        new THREE.Vector3(-0.4751, 0.7433, -0.6106),
        new THREE.Vector3(-0.8814, 1.054, 0.3796),
        new THREE.Vector3(-0.1089, 1.246, 0.1362),
        new THREE.Vector3(0.6817, 1.442, -0.1128),
        new THREE.Vector3(-0.4605, 0.585, -0.5125),
        new THREE.Vector3(-0.01001, 0.4943, -0.007016),
    ]);
    function makeChainStitch(scene: THREE.Scene, pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        ChainStitchParts.map((curve) => {
            const geometry = new THREE.TubeGeometry(curve, 50, 0.1, 10);
            const material = new THREE.MeshLambertMaterial();
            material.side = THREE.DoubleSide; // This has to be double-sided for effective intersection checking.
            material.color = new THREE.Color().setHex(Math.random() * 0xffffff); // TO-DO: Have a default stitch colour.
            material.emissive = material.color; // TO-DO: Should set up emissive when generating 3D crochet pattern.
            const mesh = new THREE.Mesh(geometry, material);

            mesh.translateX(pos.x);
            mesh.translateY(pos.y);
            mesh.translateZ(pos.z);
            scene.add(mesh);
        });
    }
</script>

<ThreeCanvas
    --height="100%"
    cameraPosition={new THREE.Vector3(0, 0, 10)}
    init={(scene: THREE.Scene) => {
        previewCanvasScene.set(scene);
        for (let i = 0; i < 10; ++i) {
            makeChainStitch(scene, new THREE.Vector3(0, 0.5 * i, 0));
        }
    }}
/>

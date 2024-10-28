<script lang="ts">
    import { models } from 'crochet-stitcher';
    import { arrayToVector3List } from '$lib/geometry/vectorHelper';
    import { makeMultiBezier } from '$lib/builder/bezier';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';

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
    const ChainStitchParts = makeMultiBezier(arrayToVector3List(models.chainStitch.points));
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
</script>

<ThreeCanvas
    cameraPosition={new Vector3(0, 0, 3)}
    init={(scene) => {
        for (let i = 0; i < 10; ++i) {
            makeChainStitch(scene, new THREE.Vector3(0, 0.5 * i, 0));
        }
    }}
/>

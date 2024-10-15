<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
  import { makeMultiBezier } from '$lib/builder/bezier';
  import ThreeCanvas from '$lib/ThreeCanvas.svelte';
  import * as THREE from 'three';
  import { Vector3 } from 'three';

  const ChainStitchParts = makeMultiBezier([
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(0.03989, -0.1529, 0.4265),
      new Vector3(-0.1251, 0.1748, 0.4262),
      new Vector3(-0.286, 0.4362, -0.05045),
      new Vector3(-0.4751, 0.7433, -0.6106),
      new Vector3(-0.8814, 1.054, 0.3796),
      new Vector3(-0.1089, 1.246, 0.1362),
      new Vector3(0.6817, 1.442, -0.1128),
      new Vector3(-0.4605, 0.585, -0.5125),
      new Vector3(-0.01001, 0.4943, -0.007016),
  ]);

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


<!-- Overlay HTML components -->
<div class="overlay">
  <label>X: <input type="range" min="-10" max="10"></label>
  <label>Y: <input type="range" min="-10" max="10"></label>
  <label>Z: <input type="range" min="1" max="20"></label>
  <textarea placeholder="hi i am a textbox"></textarea>
  <button on:click={() => alert('Overlay Button Clicked!')}>Click Me!</button>
</div>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">(icon)</svelte:fragment>
	(title)
	<svelte:fragment slot="trail">(actions)</svelte:fragment>
</AppBar>

<ThreeCanvas
  cameraPosition={new Vector3(0, 0, 10)}
  init={(scene) => {
      for (let i = 0; i < 10; ++i) {
          makeChainStitch(scene, new THREE.Vector3(0, 0.5 * i, 0));
      }
  }}
/>

<style>
  .overlay {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1;  /* Ensure it's above the canvas */
    background-color: rgba(255, 255, 255, 0.8); /* Transparent background */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  label, button {
    display: block;
    margin-bottom: 10px;
  }

  input[type="range"] {
    width: 100px;
  }
</style>
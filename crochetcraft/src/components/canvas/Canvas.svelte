<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

	export let animate: XRFrameRequestCallback;
    let canvasBinding: Element;

	onMount(() => {
		const renderer = new THREE.WebGLRenderer({ 
			antialias: true, 
			canvas: canvasBinding,
		});
		// animation
		renderer.setAnimationLoop(animate);
	})
</script>

<canvas bind:this={canvasBinding}></canvas>

<style>
	canvas {
		position: relative;
		width: 100%;
		height: auto;
	}
</style>

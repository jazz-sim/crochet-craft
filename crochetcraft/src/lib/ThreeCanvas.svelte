<script lang="ts">
    import { onMount } from 'svelte';
    import * as Three from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

    let wrapper: HTMLDivElement;
    let canvas: HTMLCanvasElement;

    /**
     * The function that initializes the scene. This is called once on component
     * mount.
     */
    export let init: (scene: Three.Scene) => void = () => {};

    /**
     * The Three.js Scene object. Bind this prop if you want to use it.
     */
    export let scene: Three.Scene = new Three.Scene();

    /** The initial position of the camera. */
    export let cameraPosition: Three.Vector3 = new Three.Vector3(0, 0, 60);

    onMount(() => {
        console.assert(canvas);
        // const width = window.innerWidth;
        // const height = window.innerHeight;
        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;

        const camera = new Three.PerspectiveCamera(70, width / height, 0.01, 100);

        scene.add(new Three.AmbientLight(0x404040, 10)); // soft white light
        // without directional light, spheres just look like flat circles
        scene.add(new Three.DirectionalLight(0x404040, 10));

        init(scene);

        const renderer = new Three.WebGLRenderer({
            antialias: true,
            canvas,
        });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        controls.update(); // Must be called after manually updating camera position

        function animation() {
            renderer.render(scene, camera);
        }
    });
</script>

<div bind:this={wrapper}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    div {
        width: 100%;
        height: 100dvh;
    }

    canvas {
        display: block;
    }
</style>

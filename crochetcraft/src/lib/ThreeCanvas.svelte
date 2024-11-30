<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
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

    /**
     * The Three.js Renderer object. Bind this prop if you want to use it.
     */
    let renderer: Three.WebGLRenderer;

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

        renderer = new Three.WebGLRenderer({
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

    /**
     * Clean up the material and textures of a Three.js object.
     */
    const cleanMaterial = (material: any) => {
        // dispose textures
        for (const key of Object.keys(material)) {
            const value = material[key];
            if (value && typeof value.dispose === 'function') {
                value.dispose();
            }
        }
        material.dispose();
    };
    /**
     * Clean up the scene when the component is destroyed.
     */
    onDestroy(() => {
        scene.traverse((obj) => {
            if (obj instanceof Three.Mesh) {
                obj.geometry.dispose();
                if (obj.material.isMaterial) {
                    // a single material
                    cleanMaterial(obj.material);
                } else {
                    // an array of materials
                    for (const material of obj.material) cleanMaterial(material);
                }
            }
        });
        renderer?.dispose();
        scene.clear();
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

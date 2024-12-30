<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import * as Three from 'three';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
    import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
    import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import State from './state.svelte';

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

    /** For toggling whether to have hover and select bloom + emission effect: */
    export let toggleBloom = false;

    onMount(() => {
        console.assert(canvas);
        // const width = window.innerWidth;
        // const height = window.innerHeight;
        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;
        const camera = new Three.PerspectiveCamera(70, width / height, 0.01, 100);

        // SET UP SCENE:
        scene.add(new Three.AmbientLight(0x404040, 10)); // soft white light
        // without directional light, spheres just look like flat circles
        scene.add(new Three.DirectionalLight(0x404040, 10));
        init(scene);

        // SET UP RENDERER:
        renderer = new Three.WebGLRenderer({
            antialias: true,
            canvas,
        });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);

        // FIX UP CAMERA:
        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        controls.update(); // Must be called after manually updating camera position

        let raycaster: Three.Raycaster;
        let mouse: Three.Vector2;
        let composer: EffectComposer;

        // CREATE BLOOM EFFECT:
        // Assumes: toggleBloom is positive and selected 3D objects are meshes, where the material is Lambert Material.
        if (toggleBloom) {
            raycaster = new Three.Raycaster();
            mouse = new Three.Vector2();
            let bloomPass = new UnrealBloomPass(
                new Three.Vector2(wrapper.clientWidth, wrapper.clientHeight),
                0.25,
                0.25,
                2,
            );
            bloomPass.renderToScreen = true;
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(bloomPass);

            let previousIntersectedObject = null as null | Three.Mesh;
            function checkIntersection(e: MouseEvent, type: String) {
                // get mouse coords:
                mouse.x = (e.offsetX / wrapper.clientWidth) * 2 - 1;
                mouse.y = -(e.offsetY / wrapper.clientHeight) * 2 + 1;
                // Get intersection list:
                const intersects = raycaster.intersectObjects(scene.children);
                let sameIntersection = false;
                let currentIntersectedObject = null as null | Three.Mesh;
                // finding the current intersected mesh:
                for (let i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.type == 'Mesh') {
                        currentIntersectedObject = intersects[i].object as Three.Mesh;
                        if (currentIntersectedObject == previousIntersectedObject) {
                            sameIntersection = true;
                        }
                        break;
                    }
                }
                if (type == 'move') {
                    // If there is no intersection conflict, highlight, else remove hightlight:
                    if (!sameIntersection) {
                        wrapper.style.cursor = 'pointer';
                        if (previousIntersectedObject) {
                            let previousMaterial =
                                previousIntersectedObject.material as Three.MeshLambertMaterial;
                            previousMaterial.emissiveIntensity = 0;
                        }
                        if (currentIntersectedObject) {
                            let currentMaterial =
                                currentIntersectedObject.material as Three.MeshLambertMaterial;
                            currentMaterial.emissiveIntensity = 10;
                        }
                        previousIntersectedObject = currentIntersectedObject;
                    }
                } else {
                    if (currentIntersectedObject) {
                        State.selectedMesh = currentIntersectedObject;
                    } else {
                        State.selectedMesh = null;
                    }
                }
            }

            wrapper.addEventListener('pointermove', (e: MouseEvent) =>
                checkIntersection(e, 'move'),
            );
            wrapper.addEventListener('click', (e: MouseEvent) => checkIntersection(e, 'click'));
        }

        window.addEventListener(
            'resize',
            () => {
                camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
            },
            false,
        );

        function animation() {
            if (toggleBloom) {
                raycaster.setFromCamera(mouse, camera);
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
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
        height: var(--height, 100dvh);
    }

    canvas {
        display: block;
    }
</style>

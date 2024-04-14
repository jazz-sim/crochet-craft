<script lang="ts">
    // Wrapping the demo three.js code in an onMount to avoid making any other changes
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    function makeBasicBezier(
        v0: THREE.Vector3,
        v1: THREE.Vector3,
        v2: THREE.Vector3,
        v3: THREE.Vector3,
    ) {
        const curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);

        const geometry = new THREE.TubeGeometry(curve, 50, 0.2, 8, false);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        return new THREE.Line(geometry, material);
    }

    class ColorDemoCube {
        private mesh: THREE.Mesh;
        private material: THREE.MeshBasicMaterial;
        private cycleTime: number;

        constructor() {
            this.cycleTime = 0;

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.translate(0, 3, 0);
            this.material = new THREE.MeshBasicMaterial({ color: this.cycleTimeToColor() });

            this.mesh = new THREE.Mesh(geometry, this.material);
        }

        getMesh(): THREE.Mesh {
            return this.mesh;
        }

        animate(dt: number) {
            this.cycleTime += dt;
            if (this.cycleTime > 4000) {
                this.cycleTime %= 4000;
            }
            this.material.color.set(this.cycleTimeToColor());
        }

        cycleTimeToColor() {
            if (this.cycleTime < 2000) {
                return 0x0000ff * this.cycleTime / 2000;
            } else {
                return 0x0000ff * (4000 - this.cycleTime) / 2000;
            }
        }
    }

    onMount(() => {
        const width = window.innerWidth,
            height = window.innerHeight;

        // init: camera, scene, geometries, renderer, and controls
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);

        const scene = new THREE.Scene();

        // Default cube with colour
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Bezier curve!
        scene.add(
            makeBasicBezier(
                new THREE.Vector3(1, -3, 0),
                new THREE.Vector3(-7, 3, 0),
                new THREE.Vector3(7, 3, 0),
                new THREE.Vector3(-1, -3, 0),
            ),
        );

        // Color-changing cube
        const colorCube = new ColorDemoCube();
        scene.add(colorCube.getMesh());

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 0, 3);
        controls.update(); // Must be called after manually updating camera position

        // animation
        let lastFrame = 0;
        function animation(time: number) {
            const dt = time - lastFrame;
            lastFrame = time;
            colorCube.animate(dt);
            renderer.render(scene, camera);
        }
    });
</script>

<h1>Three.js Testing</h1>

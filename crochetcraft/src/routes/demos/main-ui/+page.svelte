<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton';
    import { makeMultiBezier } from '$lib/builder/bezier';
    import ThreeCanvas from '$lib/ThreeCanvas.svelte';
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import { browser } from '$app/environment';

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
    if (browser) {
        // Make the DIV element draggable:
        dragElement(document.getElementById('overlay') as HTMLElement);
    }

    function dragElement(elmnt: HTMLElement | null) {
        if (!elmnt) return; // Guard clause to prevent null reference
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        const header = document.getElementById(elmnt.id + "header");
        if (header) {
            /* if present, the header is where you move the DIV from:*/
            header.onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: MouseEvent) {
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            if (elmnt) {
                elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
            }
            if (elmnt) {
                elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
            }
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
</script>

<!-- Overlay HTML components -->
<div id="overlay" class="overlay">
  <h1 id="overlayheader">Stuff</h1>
    <label>X: <input type="range" min="-10" max="10" /></label>
    <label>Y: <input type="range" min="-10" max="10" /></label>
    <label>Z: <input type="range" min="1" max="20" /></label>
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
        padding: 10px;
        cursor: move;
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1; /* Ensure it's above the canvas */
        background-color: rgba(255, 255, 255, 0.8); /* Transparent background */
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    label,
    button {
        display: block;
        margin-bottom: 10px;
    }

    input[type='range'] {
        width: 100px;
    }
</style>

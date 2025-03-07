<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import State from '$lib/state.svelte';
    import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
    import { downloadBlob } from '$lib/files';
    import GLTFLogo from '$lib/assets/GlTF_logo.png';
    import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
    import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
    import { AxesHelper, AmbientLight, Mesh, MeshLambertMaterial, MeshBasicMaterial } from 'three';

    import * as TextureUtils from 'three/addons/utils/WebGLTextureUtils.js';

    // Style + variables for the modal:
    const cBase = 'card p-4 w-modal shadow-xl space-y-4 rounded-lg';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-lg';
    export let parent: SvelteComponent;
    let isOBJ: boolean = true;

    let currAxesHelper = State.scene.getObjectByName('axesHelper') as AxesHelper;

    /** Downloads the 3D model in OBJ format. */
    function downloadModel(isOBJ: Boolean) {
        const exporter = isOBJ
            ? new OBJExporter()
            : new GLTFExporter().setTextureUtils(TextureUtils);
        const options = {
            trs: false,
            onlyVisible: true,
            binary: false,
            maxTextureSize: 4096,
        };
        if (isOBJ) {
            const objData = (exporter as OBJExporter).parse(State.scene);
            const objBlob = new Blob([objData]);
            downloadBlob(objBlob, 'pattern.obj');
        } else {
            // First, only directional, point, and spot lights are supported, so we need to remove the ambient light in the scene before saving:
            const currAmbientLight = State.scene.getObjectByName('ambientLight') as AmbientLight;
            let saveAmbientLight: null | AmbientLight = null;
            if (currAmbientLight) {
                saveAmbientLight = currAmbientLight.clone();
                State.scene.remove(currAmbientLight);
            }

            // Next, turn meshes into the MeshBasicMaterial type:
            let saveMeshInfo = new Map();
            State.scene.traverse(function (object) {
                if (object instanceof Mesh) {
                    let prevMaterial = object.material as MeshLambertMaterial;
                    object.material = new MeshBasicMaterial();
                    object.material.copy(prevMaterial);
                    saveMeshInfo.set(object.id, prevMaterial);
                }
            });
            // Then, export the copied scene:
            (exporter as GLTFExporter).parse(
                State.scene,
                function (res) {
                    const gltfData = JSON.stringify(res);
                    const gltfBlob = new Blob([gltfData], { type: 'text/plain' });
                    downloadBlob(gltfBlob, 'pattern.gltf');
                },
                function (err) {
                    console.log('An error happened during parsing for GLTF', err);
                },
                options,
            );
            // Finally, reset the lights and meshes (and axes helper):
            if (saveAmbientLight) {
                State.scene.add(saveAmbientLight);
            }
            State.scene.traverse(function (object) {
                const objCast = object as Mesh;
                if (objCast.isMesh) {
                    objCast.material = new MeshLambertMaterial();
                    objCast.material.copy(saveMeshInfo.get(objCast.id));
                }
            });
        }
    }
</script>

<div class={cBase}>
    <header class={cHeader}>Download Options</header>
    <div class={cForm}>
        <h4 class="font-bold">File Type</h4>
        <RadioGroup rounded="rounded-lg">
            <RadioItem bind:group={isOBJ} name="OBJ" value={true}>
                <div class="flex flex-row items-center space-x-1">
                    <i class="fi fi-br-cubes"></i>
                    <p>OBJ</p>
                </div>
            </RadioItem>
            <RadioItem bind:group={isOBJ} name="glTF" value={false}>
                <div class="flex flex-row items-center space-x-1">
                    <img src={GLTFLogo} alt={'glTF logo'} width={50} height={50} />
                    <p>glTF</p>
                </div>
            </RadioItem>
        </RadioGroup>
        <p>
            {isOBJ == true
                ? 'OBJ is a geometry data file format. Material (and therefore colour data) is not supported.'
                : 'glTF is a 3D scene / model file format. Also stores material and lights data.'}
        </p>
        {#if isOBJ == false && currAxesHelper.visible}<div
                class="card variant-ghost-warning rounded-lg p-4"
            >
                Turn off the axes helper if you do not want it appearing in your render.
            </div>{/if}
    </div>
    <footer class={parent.regionFooter}>
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Cancel</button>
        <button
            class="btn {parent.buttonPositive}"
            on:click={() => {
                downloadModel(isOBJ);
                parent.onClose();
            }}>Download</button
        >
    </footer>
</div>

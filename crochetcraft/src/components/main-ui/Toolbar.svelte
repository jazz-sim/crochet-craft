<script lang="ts">
    import { textContent, previewCanvasScene } from './stores';
    import { get } from 'svelte/store';
    import { AppBar } from '@skeletonlabs/skeleton';
    import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget;
    }
    async function setUpReader(file: File) {
        let uploadReader = new FileReader();
        uploadReader.addEventListener(
            'load',
            () => {
                let input = uploadReader.result as string;
                textContent.set(input);
            },
            false,
        );
        uploadReader.readAsText(file);
    }

    function upload(e: Event) {
        const fileEvent = e as HTMLInputEvent;
        let files: any = fileEvent.target.files;
        if (files) {
            let inputFile = files[0];
            setUpReader(inputFile);
        }
    }
    function download(type: String) {
        let blob = new Blob([$textContent], { type: 'text/plain' });
        let filename = 'pattern.txt';
        if (type == '3d-object') {
            const exporter = new OBJExporter();
            const data = exporter.parse(get(previewCanvasScene));
            blob = new Blob([data]);
            filename = 'pattern.obj';
        }
        const url = URL.createObjectURL(blob);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <svelte:fragment slot="lead">
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        <label for="file-upload" class="custom-file-upload variant-filled-surface btn rounded-lg">
            Upload Pattern Text
        </label>
        <input id="file-upload" type="file" accept=".txt" on:change={(e) => upload(e)} />
        <button
            class="variant-filled-surface btn rounded-lg"
            on:click={() => download('pattern-text')}>Download Pattern Text</button
        >
        <button class="variant-filled-surface btn rounded-lg" on:click={() => download('3d-object')}
            >Export 3D Object</button
        >
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
    </svelte:fragment>
</AppBar>

<style>
    input[type='file'] {
        display: none;
    }
    .custom-file-upload {
        cursor: pointer;
    }
</style>

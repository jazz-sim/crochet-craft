<script lang="ts">
    import { downloadBlob } from '$lib/files';
    import State from '$lib/state.svelte';
    import { LightSwitch, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

    const modalStore = getModalStore();

    async function onUpload(e: Event & { currentTarget: HTMLInputElement }) {
        let files = e.currentTarget.files;
        if (files) {
            let inputFile = files[0];
            State.pattern = await inputFile.text();
        }
    }

    /** Downloads the pattern text. */
    function downloadPattern() {
        const blob = new Blob([State.pattern], { type: 'text/plain' });
        downloadBlob(blob, 'pattern.txt');
    }

    /** Downloads the 3D model in OBJ format. */
    function downloadModel() {
        const exporter = new OBJExporter();
        const data = exporter.parse(State.scene);
        const blob = new Blob([data]);
        downloadBlob(blob, 'pattern.obj');
    }

    // Triggering "about" modal:
    const modal: ModalSettings = {
        type: 'alert',
        title: '<div class="flex justify-center items-center"><img src="/cc-logo-new-1-purple.png" width="65%" alt="CrochetCraft logo." /></div>',
        body: '<div class="flex justify-center items-center"><p>CrochetCraft is a Final Year Design Project (FYDP).</p></div>',
        buttonTextCancel: 'Close',
    };

    function showAboutModal() {
        modalStore.trigger(modal);
    }
</script>

<div class="flex w-full flex-row flex-wrap items-center gap-3 px-4 py-3">
    <!-- Left side -->
    <button class="btn-icon !bg-transparent" onclick={showAboutModal}>
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
    </button>

    <label class="variant-filled-surface btn cursor-pointer rounded-lg">
        Upload Pattern Text...
        <input type="file" accept=".txt" onchange={(e) => onUpload(e)} class="hidden" />
    </label>
    <button class="variant-filled-surface btn rounded-lg" onclick={downloadPattern}>
        Download Pattern Text
    </button>
    <button class="variant-filled-surface btn rounded-lg" onclick={downloadModel}>
        Export 3D Object
    </button>

    <div class="flex-1"></div>

    <!-- Right side -->
    <a class="anchor" href="/">← Go Home</a>
    <LightSwitch rounded="rounded-lg" />
</div>

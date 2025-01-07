<script lang="ts">
    import { downloadBlob } from '$lib/files';
    import State from '$lib/state.svelte';
    import {
        LightSwitch,
        getModalStore,
        type ModalSettings,
        type ModalComponent,
    } from '@skeletonlabs/skeleton';
    import * as Modals from '$components/modals/index';

    const modalStore = getModalStore();
    const aboutModalComponent: ModalComponent = { ref: Modals.AboutModal };
    const downloadModalComponent: ModalComponent = { ref: Modals.DownloadModal };

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

    // Triggering "download" modal:
    const downloadModal: ModalSettings = {
        type: 'component',
        component: downloadModalComponent,
    };

    function showDownloadModal() {
        modalStore.trigger(downloadModal);
    }

    // Triggering "about" modal:
    const aboutModal: ModalSettings = {
        type: 'component',
        component: aboutModalComponent,
    };

    function showAboutModal() {
        modalStore.trigger(aboutModal);
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
        Download Pattern Text...
    </button>
    <button class="variant-filled-surface btn rounded-lg" onclick={showDownloadModal}>
        Export 3D Object...
    </button>

    <div class="flex-1"></div>

    <!-- Right side -->
    <a class="anchor" href="/">← Go Home</a>
    <LightSwitch rounded="rounded-lg" />
</div>

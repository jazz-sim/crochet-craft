<script lang="ts">
    import State from '$lib/state.svelte';
    import { AppBar, LightSwitch, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

    const modalStore = getModalStore();

    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget;
    }

    // Reading uploaded file:
    async function setUpReader(file: File) {
        let uploadReader = new FileReader();
        uploadReader.addEventListener(
            'load',
            () => {
                State.pattern = uploadReader.result as string;
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

    // Downloading pattern:
    function download(type: string) {
        let blob = new Blob([State.pattern], { type: 'text/plain' });
        let filename = 'pattern.txt';
        if (type == '3d-object') {
            const exporter = new OBJExporter();
            const data = exporter.parse(State.scene);
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

<AppBar
    gridColumns="grid-cols-[auto_1fr_auto]"
    slotDefault="place-self-center"
    slotLead="place-content-start space-x-4"
    slotTrail="place-content-end"
>
    <svelte:fragment slot="lead">
        <button class="btn-icon !bg-transparent" on:click={showAboutModal}>
            <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        </button>

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
        <a class="anchor" href={`/`}>← Go Home</a>
        <LightSwitch rounded="rounded-lg" />
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

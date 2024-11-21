<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton';
    function download(type: String) {
        if (type == 'pattern-text') {
            // Get pattern text from Editor?
        } else if (type == '3d-object') {
        }
    }
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <svelte:fragment slot="lead">
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        <label for="file-upload" class="custom-file-upload variant-filled-surface btn rounded-lg">
            Upload Pattern Text
        </label>
        <input id="file-upload" type="file" />
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

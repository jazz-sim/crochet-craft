<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <svelte:fragment slot="lead">
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        <button class="variant-filled-surface btn rounded-lg">Upload Pattern Text</button>
        <button class="variant-filled-surface btn rounded-lg">Download Pattern Text</button>
        <button class="variant-filled-surface btn rounded-lg">Export 3D Object</button>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <a class="anchor" href={`/demos`}>📺 Back To Demos</a>
    </svelte:fragment>
</AppBar>

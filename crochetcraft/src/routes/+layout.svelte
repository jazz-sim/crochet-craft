<script lang="ts">
    import '../app.css';
    import '../styles/global.css';
    import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
    <svelte:fragment slot="lead">
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
    </svelte:fragment>
    <b>CrochetCraft - Debug + Experimental Pages</b>
    <svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
</AppBar>
<slot />

<script lang="ts">
    import { initializeStores, Modal } from '@skeletonlabs/skeleton';
    import '../app.css';

    let { children } = $props();

    initializeStores();
</script>

<Modal rounded="rounded-lg" buttonNeutral="rounded-lg variant-filled-surface" />

{@render children()}

<script lang="ts">
    import type { SvelteComponent } from 'svelte';

    // Style + variables for the modal:
    const cBase = 'card p-4 w-modal shadow-xl space-y-4 rounded-lg';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
    export let parent: SvelteComponent;
</script>

<div class={cBase}>
    <header class={cHeader}>
        <div class="flex items-center justify-center">
            <img src="/cc-logo-new-1-purple.png" width="65%" alt="CrochetCraft logo." />
        </div>
    </header>
    <div id="aboutBody">
        <div class="flex items-center justify-center">
            <p>CrochetCraft is a Final Year Design Project (FYDP).</p>
        </div>
    </div>
    <footer class={parent.regionFooter}>
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Close</button>
    </footer>
</div>

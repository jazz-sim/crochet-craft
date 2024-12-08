<script lang="ts">
    import { draggable } from '@neodrag/svelte';
    import plus from '$lib/assets/white-plus.png';
    import minus from '$lib/assets/white-minus.png';

    let panelContents: HTMLDivElement;
    let panelButtonState = true;
    function collapsePanel() {
        if (panelButtonState) {
            panelContents.style.display = 'none';
        } else {
            panelContents.style.display = 'block';
        }
        panelButtonState = !panelButtonState;
    }
</script>

<div
    use:draggable={{ bounds: '#render-div', handle: '.panel-bar' }}
    class="overlay card rounded-lg"
>
    <div class="panel-bar variant-soft-primary card flex flex-row justify-between rounded-t-lg p-4">
        <slot class="justify-start" name="panel-title" />
        <button
            class="btn-icon btn-icon-sm variant-filled-surface justify-end rounded-lg"
            title={panelButtonState ? 'Minimize' : 'Maximize'}
            aria-label={panelButtonState ? 'Minimize' : 'Maximize'}
            on:click={collapsePanel}
            ><img
                src={panelButtonState ? minus : plus}
                alt={panelButtonState ? 'Minimize' : 'Maximize'}
            /></button
        >
    </div>
    <div class="p-4" bind:this={panelContents}><slot name="panel-elements" /></div>
</div>

<style>
    .overlay {
        position: absolute;
        z-index: 1; /* Ensure it's above the canvas */
        width: 400px;
        top: var(--top, 10px);
        left: var(--left, 10px);
        display: var(--display, 'initial');
    }
    .panel-bar {
        padding: none;
        cursor: move;
    }
</style>

<script lang="ts">
    import { draggable } from '@neodrag/svelte';
</script>

<div use:draggable={{ bounds: '#sample-ui-div' }} class="overlay card rounded-lg">
    <div class="bar card variant-glass-primary flex flex-row justify-between rounded-t-lg p-4">
        <slot class="justify-start" name="panel-title" />
        <button class="btn btn-sm variant-filled-surface justify-end rounded-lg" title="Minimize"
            >―</button
        >
    </div>
    <section class="p-4"><slot name="panel-elements" /></section>
</div>

<style>
    .overlay {
        position: absolute;
        z-index: 1; /* Ensure it's above the canvas */
        width: 400px;
        top: var(--top, 100px);
        left: var(--left, 10px);
        display: var(--display, 'initial');
    }
    .bar {
        padding: none;
        cursor: move;
    }
</style>

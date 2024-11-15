<div class="overlay card rounded-lg">
    <div class="bar card variant-filled-surface rounded-t-lg p-4"></div>
    <header class="card-header"><slot name="panel-title" /></header>
    <section class="p-4"><slot name="panel-elements" /></section>
</div>

<style>
    .overlay {
        position: absolute;
        z-index: 1; /* Ensure it's above the canvas */
        width: 400px;
        top: var(--top, 100px);
        left: var(--left, 10px);
    }
    .bar {
        padding: none;
    }
</style>

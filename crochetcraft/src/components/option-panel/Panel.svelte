<div class="overlay card">
    <div class="bar card p-4"></div>
    <header class="card-header"><slot name="panel-title" /></header>
    <section class="p-4"><slot name="panel-elements" /></section>
</div>

<style>
    .overlay {
        position: absolute;
        z-index: 1; /* Ensure it's above the canvas */
        border-radius: 8px;
        width: 400px;
        top: var(--top, 100px);
        left: var(--left, 10px);
    }
    .bar {
        background-color: grey;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        padding: none;
    }
</style>

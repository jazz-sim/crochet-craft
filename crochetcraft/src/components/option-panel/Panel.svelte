<div class="overlay">
    <slot />
</div>

<style>
    .overlay {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1; /* Ensure it's above the canvas */
        background-color: rgba(255, 255, 255, 0.8); /* Transparent background */
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
</style>

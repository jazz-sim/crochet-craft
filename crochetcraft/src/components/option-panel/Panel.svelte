<script lang="ts">
    import { draggable } from '@neodrag/svelte';
    import type { Snippet } from 'svelte';

    let {
        children,
        title,
        position,
        shown = true,
    }: {
        children: Snippet;
        title: string;
        position: 'left' | 'right';
        shown?: boolean;
    } = $props();

    let expanded = $state(true);
</script>

<div
    use:draggable={{ bounds: '#render-div', handle: '.panel-bar' }}
    class="card absolute top-2 z-10 w-96 rounded-lg"
    class:left-2={position === 'left'}
    class:right-2={position === 'right'}
    class:hidden={!shown}
>
    <div
        class="panel-bar variant-soft-primary card flex cursor-move flex-row justify-between rounded-t-lg p-4"
    >
        <h4 class="h4">{title}</h4>
        <button
            class="btn-icon btn-icon-sm variant-filled-surface rounded-lg"
            title={expanded ? 'Collapse' : 'Expand'}
            aria-label={expanded ? 'collapse panel' : 'expand panel'}
            onclick={() => (expanded = !expanded)}
        >
            {#if expanded}
                <i class="fi fi-br-minus"></i>
            {:else}
                <i class="fi fi-br-plus"></i>
            {/if}
        </button>
    </div>
    <div class="space-y-4 p-4" class:hidden={!expanded}>{@render children()}</div>
</div>

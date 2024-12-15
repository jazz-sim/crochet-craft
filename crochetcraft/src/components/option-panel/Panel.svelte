<script module lang="ts">
    export type PanelPosition = 'left' | 'right' | 'docked';
</script>

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
        position: PanelPosition;
        shown?: boolean;
    } = $props();

    let expanded = $state(true);
</script>

{#snippet cardContent()}
    <div
        class="panel-bar variant-soft-primary card flex flex-none flex-row justify-between p-4"
        class:cursor-move={position !== 'docked'}
        class:rounded-t-lg={position !== 'docked'}
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
    <div class="flex-1 space-y-4 overflow-y-auto p-4" class:hidden={!expanded}>
        {@render children()}
    </div>
{/snippet}

{#if position === 'docked'}
    <div class="card z-10 flex w-96 flex-none flex-col">
        {@render cardContent()}
    </div>
{:else}
    <div
        use:draggable={{ bounds: '#render-div', handle: '.panel-bar' }}
        class="card absolute top-2 z-10 flex max-h-[calc(100%-1rem)] w-96 flex-none flex-col rounded-lg"
        class:left-2={position === 'left'}
        class:right-2={position === 'right'}
        class:hidden={!shown}
    >
        {@render cardContent()}
    </div>
{/if}

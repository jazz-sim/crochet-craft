<script module lang="ts">
    export type PanelPosition = 'left' | 'right' | 'docked';
</script>

<script lang="ts">
    import { draggable } from '@neodrag/svelte';
    import plus from '$lib/assets/white-plus.png';
    import minus from '$lib/assets/white-minus.png';
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
        class="panel-bar variant-soft-primary card flex cursor-move flex-row justify-between p-4"
        class:rounded-t-lg={position !== 'docked'}
    >
        <h4 class="h4">{title}</h4>
        {#if position !== 'docked'}
            <button
                class="btn-icon btn-icon-sm variant-filled-surface justify-end rounded-lg"
                title={expanded ? 'Minimize' : 'Maximize'}
                aria-label={expanded ? 'Minimize' : 'Maximize'}
                onclick={() => (expanded = !expanded)}
            >
                <img src={expanded ? minus : plus} alt={expanded ? 'Minimize' : 'Maximize'} />
            </button>
        {/if}
    </div>
    <div class="space-y-4 p-4" class:hidden={!expanded}>{@render children()}</div>
{/snippet}

{#if position === 'docked'}
    <div class="card z-10 w-96 flex-none">
        {@render cardContent()}
    </div>
{:else}
    <div
        use:draggable={{ bounds: '#render-div', handle: '.panel-bar' }}
        class="card absolute top-2 z-10 w-96 flex-none rounded-lg"
        class:left-2={position === 'left'}
        class:right-2={position === 'right'}
        class:hidden={!shown}
    >
        {@render cardContent()}
    </div>
{/if}

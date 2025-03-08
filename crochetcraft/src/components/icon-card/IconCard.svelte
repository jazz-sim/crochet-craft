<script lang="ts">
    import type { Snippet } from 'svelte';
    let {
        icon,
        title,
        content,
        variant = 'variant-ghost-primary',
    }: {
        icon: string;
        title: string;
        content: Snippet;
        variant?: string;
    } = $props();
</script>

<div class={'card mt-2 flex w-full flex-col rounded-lg p-4 '.concat(variant)}>
    <div class="flex flex-row items-center gap-2">
        <span class={'badge-icon '.concat(variant)}><i class={icon}></i></span>
        <b>{title}</b>
    </div>
    <div class="flex flex-row gap-7">
        <div class="indent"></div>
        <div class="content">{@render content()}</div>
    </div>
</div>

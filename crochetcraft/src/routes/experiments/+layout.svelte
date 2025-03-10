<script lang="ts">
    import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="flex h-full flex-col">
    <div class="flex w-full flex-row flex-wrap items-center gap-3 px-4 py-3">
        <!-- Left side -->
        <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        <div class="flex-1"></div>
        <b>CrochetCraft - Experimental Pages - <a class="anchor" href="/">Return home?</a></b>
        <div class="flex-1"></div>
        <!-- Right side -->
        <LightSwitch rounded="rounded-lg" />
    </div>
    <div id="render-div" class="relative flex min-h-0 flex-1 flex-row">
        <slot />
    </div>
</div>

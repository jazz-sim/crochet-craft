<script lang="ts">
    import { goto } from '$app/navigation';
    import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="flex h-full flex-col">
    <div class="flex w-full flex-row flex-wrap items-center gap-3 px-4 py-3">
        <!-- Left side -->
        <button class="btn-icon !bg-transparent" onclick={() => goto('/')}>
            <img src="/cc-logo-new-2-purple.png" width="50" height="50" alt="CrochetCraft logo." />
        </button>
        <div class="flex-1"></div>
        <!-- Right side -->
        <LightSwitch rounded="rounded-lg" />
    </div>
    <div class="flex h-full flex-col items-center justify-center">
        <img class="p-5" src="/cc-logo-new-1-purple.png" width="500px" alt="CrochetCraft logo." />
        <h3 class="h3">
            Uh-oh! There's no page here. <a class="anchor" href="/"><b>Return home?</b></a>
        </h3>
    </div>
</div>

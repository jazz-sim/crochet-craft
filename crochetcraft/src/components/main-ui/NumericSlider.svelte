<script lang="ts">
    let {
        value = $bindable(),
        min,
        max,
        sliderMin,
        sliderMax,
        sliderStep,
    }: {
        value: number;
        min: number;
        max: number;
        sliderMin: number;
        sliderMax: number;
        sliderStep: number;
    } = $props();

    $effect(() => {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
    });
</script>

<div class="flex w-full flex-row gap-4">
    <input
        class="input flex-1"
        type="range"
        min={sliderMin}
        step={sliderStep}
        max={sliderMax}
        bind:value
    />
    <input type="number" class="input w-20 flex-none" bind:value />
</div>

<script lang="ts">
    let {
        value = $bindable(),
        min,
        max,
        sliderMin,
        sliderMax,
        sliderStep,
        onchange,
    }: {
        value: number;
        min: number;
        max: number;
        sliderMin: number;
        sliderMax: number;
        sliderStep: number;
        onchange: Function;
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
        onchange={(event) => onchange(event.currentTarget.value)}
        bind:value
    />
    <input
        type="number"
        class="input w-20 flex-none"
        onchange={(event) => onchange(event.currentTarget.value)}
        bind:value
    />
</div>

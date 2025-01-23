<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import { parse } from 'crochet-stitcher';

    let { position }: { position: PanelPosition } = $props();

    interface AddStitchButtonData {
        name: string;
        hovertext: string;
        disabled: boolean;
    }

    const ADD_STITCH_BUTTONS: AddStitchButtonData[] = [
        { name: 'ch', hovertext: 'chain', disabled: false },
        { name: 'slst', hovertext: 'slip stitch', disabled: true },
        { name: 'sc', hovertext: 'single crochet', disabled: false },
        { name: 'dc', hovertext: 'double crochet', disabled: true },
        { name: 'tr', hovertext: 'treble crochet', disabled: true },
        { name: 'hdc', hovertext: 'half double crochet', disabled: true },
        { name: 'inc', hovertext: 'increase', disabled: true },
        { name: 'dec', hovertext: 'decrease', disabled: true },
    ];

    let errorMessage: string | null = $state(null);

    function runParser() {
        try {
            parse(State.pattern);
            errorMessage = null;
        } catch (error) {
            errorMessage = '❌ ' + error;
        }
    }

    function appendToPattern(stitch: string) {
        if (!/^$|[\n:,.]\s*$/.test(State.pattern)) {
            State.pattern += ', ';
        } else if (!/^$|\s$/.test(State.pattern)) {
            State.pattern += ' ';
        }
        State.pattern += stitch;
        runParser();
    }
</script>

<Panel title="Pattern" {position}>
    <!-- Input textarea -->
    <textarea
        aria-label="pattern text input"
        class="textarea rounded-lg"
        rows="6"
        placeholder="Enter your crochet pattern here"
        bind:value={State.pattern}
        oninput={runParser}
        onchange={runParser}
    ></textarea>

    <!-- Output feedback -->
    {#if State.pattern}
        <pre
            class:text-error-500={errorMessage !== null}
            class:text-success-500={errorMessage === null}
            class="whitespace-break-spaces">{errorMessage ?? '✅ Valid pattern.'}</pre>
    {/if}

    <div class="flex flex-wrap gap-1">
        {#each ADD_STITCH_BUTTONS as { name, hovertext, disabled }}
            <button
                aria-label="add {hovertext}"
                class="btn-sm variant-filled-surface rounded-lg"
                title={hovertext}
                onclick={() => appendToPattern(name)}
                {disabled}
            >
                {name}
            </button>
        {/each}
    </div>

    <label class="label">
        <span>Next Stitch Colour</span>
        <input
            type="color"
            class="input block !rounded-full"
            value="#d281fb"
            onchange={(event) => appendToPattern(event.currentTarget.value + ':')}
        />
    </label>
</Panel>

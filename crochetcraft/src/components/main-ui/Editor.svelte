<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import { parse } from 'crochet-stitcher';

    interface AddStitchButtonData {
        name: string;
        hovertext: string;
    }

    const ADD_STITCH_BUTTONS: AddStitchButtonData[] = [
        { name: 'ch', hovertext: 'chain' },
        { name: 'slst', hovertext: 'slip stitch' },
        { name: 'sc', hovertext: 'single crochet' },
        { name: 'dc', hovertext: 'double crochet' },
        { name: 'tr', hovertext: 'treble crochet' },
        { name: 'dec', hovertext: 'decrease' },
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

<Panel title="Pattern" position="left">
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
        {#each ADD_STITCH_BUTTONS as { name, hovertext }}
            <button
                aria-label="add {hovertext}"
                class="btn-sm variant-filled-surface rounded-lg"
                title={hovertext}
                onclick={() => appendToPattern(name)}
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

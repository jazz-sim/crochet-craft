<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import { parse, link, place, elaborate, gdPlace } from 'crochet-stitcher';
    import type { LinkedStitch, ParsedInstruction, Pattern } from 'crochet-stitcher/types';
    import { Group } from 'three';

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

    const examplePatterns: { [key: string]: string } = {
        'default chain': 'ch 10',
        '3x3 square': 'ch 4, turn, sc 3, ch1, turn, sc3',
        '3x10 rectangle': 'ch 11, turn, sc 10, ch1, turn, sc10',
        '5x10 cylinder': 'ch 10, sc 40',
        '10x20 cylinder': 'ch 20, sc 180',
        '30 ring': 'ch 30, sc 1',
    };
    const examplePatternNames = Object.keys(examplePatterns);
    let selectedExampleName = 'default chain';

    let placerMaxIterations = 50;
    let mainGroup: Group = new Group();

    $effect(() => {
        runPipeline();
    });

    function runPipeline() {
        let parseResult: Pattern<ParsedInstruction>;
        // First, attempt to parse the input pattern:
        try {
            parseResult = parse(State.pattern);
            errorMessage = null;
        } catch (error) {
            errorMessage = '❌ ' + error;
        }
        if (errorMessage == null) {
            // If the input pattern is ok, clear the rendered group of meshes:
            mainGroup.clear();
            State.scene.remove(mainGroup);
            const placer = State.placerAlgo
                ? place
                : (pat: Pattern<LinkedStitch>) => gdPlace(pat, placerMaxIterations);
            const elaboratedPoints = elaborate(placer(link(parse(State.pattern))));
            elaboratedPoints.forEach((mesh) => mainGroup.add(mesh));
            State.scene.add(mainGroup);
        }
    }

    function appendToPattern(stitch: string) {
        if (!/^$|[\n:,.]\s*$/.test(State.pattern)) {
            State.pattern += ', ';
        } else if (!/^$|\s$/.test(State.pattern)) {
            State.pattern += ' ';
        }
        State.pattern += stitch;
        runPipeline();
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
        oninput={runPipeline}
        onchange={runPipeline}
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
            value={State.nextStitchColour}
            onchange={(event) => {
                let colourValue = event.currentTarget.value;
                appendToPattern(colourValue + ':');
                State.nextStitchColour = colourValue;
            }}
        />
    </label>
</Panel>

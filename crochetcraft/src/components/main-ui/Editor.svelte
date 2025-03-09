<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { parse, link, place, elaborate, gdPlace } from 'crochet-stitcher';
    import type { LinkedStitch, ParsedInstruction, Pattern } from 'crochet-stitcher/types';
    import { Group } from 'three';

    let { position }: { position: PanelPosition } = $props();

    // For the individual stitch buttons:
    interface AddStitchButtonData {
        name: string;
        hovertext: string;
        disabled: boolean;
    }
    const ADD_STITCH_BUTTONS: AddStitchButtonData[] = [
        { name: 'ch', hovertext: 'chain', disabled: false },
        { name: 'slst', hovertext: 'slip stitch', disabled: false },
        { name: 'sc', hovertext: 'single crochet', disabled: false },
        { name: 'dc', hovertext: 'double crochet', disabled: false },
        { name: 'tr', hovertext: 'treble crochet', disabled: false },
        { name: 'hdc', hovertext: 'half double crochet', disabled: false },
        { name: 'inc', hovertext: 'increase', disabled: false },
        { name: 'dec', hovertext: 'decrease', disabled: false },
    ];
    let errorMessage: string | null = $state(null);

    // For the example pattern combobox:
    const popupComboboxExamplePatterns: PopupSettings = {
        event: 'click',
        target: 'popupCombobox',
        placement: 'bottom',
        closeQuery: '.listbox-item',
    };
    const examplePatterns: { [key: string]: string } = {
        'default chain': 'ch 10',
        '3x3 square': 'ch 4, turn, sc 3, ch1, turn, sc3',
        '3x10 rectangle': 'ch 11, turn, sc 10, ch1, turn, sc10',
        '5x10 cylinder': 'ch 10, sc 40',
        '10x20 cylinder': 'ch 20, sc 180',
        '30 ring': 'ch 30, sc 1',
    };
    const examplePatternNames = Object.keys(examplePatterns);
    let selectedExampleName = $state('default chain');

    let placerMaxIterations = 50;
    let mainGroup: Group = new Group();

    $effect(() => {
        runPipeline();
    });

    function runPipeline() {
        if (Object.values(examplePatterns).find((pat) => State.pattern === pat) == undefined) {
            selectedExampleName = 'Select an example...';
        }
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

    function exampleUpdatePattern() {
        if (selectedExampleName != 'Select an example...') {
            State.pattern = examplePatterns[selectedExampleName];
        }
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

    <!-- Add stitch buttons -->
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

    <!-- Example patterns combobox -->
    <select
        class="select rounded-lg"
        bind:value={selectedExampleName}
        onchange={exampleUpdatePattern}
    >
        <option disabled selected value="Select an example...">Select an example...</option>
        {#each examplePatternNames as exPattern}
            <option value={exPattern}>{exPattern}</option>
        {/each}
    </select>

    <!-- Next Stitch Colour picker -->
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

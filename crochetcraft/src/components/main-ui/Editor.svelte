<script lang="ts">
    import Panel, { type PanelPosition } from '$components/option-panel/Panel.svelte';
    import State from '$lib/state.svelte';
    import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { parse, link, place, elaborate, gdPlace } from 'crochet-stitcher';
    import type { LinkedStitch, ParsedInstruction, Pattern } from 'crochet-stitcher/types';
    import { BufferGeometry, Group, MeshLambertMaterial, Mesh } from 'three';
    import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

    let { position }: { position: PanelPosition } = $props();

    // For the individual stitch buttons:
    interface AddStitchButtonData {
        name: string;
        hovertext: string;
        disabled: boolean;
    }
    const ADD_STITCH_BUTTONS: AddStitchButtonData[] = [
        { name: 'ch', hovertext: 'chain', disabled: false },
        { name: 'sc', hovertext: 'single crochet', disabled: false },
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
        'default colour: 10 chain': 'ch 10',
        'default colour: 3x3 square': 'ch 4, turn, sc 3, ch1, turn, sc3',
        'white: 3x10 rectangle': 'white: ch 11, turn, sc 10, ch1, turn, sc10',
        'yellow: 5x10 cylinder': 'yellow: ch 10, sc 40',
        'yellow: 10x20 cylinder': 'yellow: ch 20, sc 180',
        'default colour: 30 ring': 'ch 30, sc 1',
        'pink: triangle': `1. pink: ch 10, turn
2. sc 9, turn
3. sc 8, turn
4. sc 7, turn
5. sc 6, turn
6. sc 5, turn
7. sc 4, turn
8. sc 3, turn
9. sc 2, turn
10. sc 1`,
        'light blue: circle': `\
1. MR, lightblue: 6 sc
2. 6 inc
3. 6 (inc, 1 sc)
4. 1 sc, 5 (inc, 2 sc), inc, sc
5. 6 (inc, 3sc)
6. 3 sc, 5 (inc, 4 sc), inc, sc
7. 6 (inc, 5 sc)
8. 4 sc, 5 (inc, 6 sc), inc, 2 sc
9. 6 (inc, 7 sc)
10. 5 sc, 5 (inc, 8 sc), inc, 3 sc`,
        'default colour: bowl': `\
1. MR, sc 6
2. inc 6
3. 6 (sc 1, inc 1)
4. 2 (sc 2, inc 1), sc 3, 3 (sc 2, inc 1)
5. sc 7, 2 (inc 1, sc 7)
6. sc 25
7. sc 25`,
        'default colour: sphere': `\
1. MR, sc 6
2. inc 6
3. 6 (sc, inc)
4. sc 18
5. sc 18
6. sc 18
7. 6 (sc, dec)
8. 6 dec`,
    };
    const examplePatternNames = Object.keys(examplePatterns);
    let selectedExampleName = $state('default colour: 10 chain');

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
            const elaboratedMeshes = elaborate(placer(link(parse(State.pattern))));
            // Before adding the meshes to the scene, merge each curve to comprise a stitch:
            const mergedMeshes = elaboratedMeshes.map((stitch) => {
                let stitchMeshMaterial = stitch[0].material as MeshLambertMaterial;
                stitchMeshMaterial.emissiveIntensity = 0;
                let stitchGeometryCollection = stitch.map((mesh) => {
                    mesh.updateMatrix();
                    return mesh.geometry;
                });
                let singleGeometry = mergeGeometries(stitchGeometryCollection);
                return new Mesh(singleGeometry, stitchMeshMaterial);
            });

            mergedMeshes.forEach((mesh) => mainGroup.add(mesh));
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
        class="custom-select select rounded-lg"
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

<style>
    .custom-select:hover {
        cursor: pointer;
    }
</style>

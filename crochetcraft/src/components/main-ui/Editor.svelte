<script lang="ts">
    import { textContent, textContentError, nextStitchColourValue } from './stores';
    import Panel from '$components/option-panel/Panel.svelte';
    import { parse } from 'crochet-stitcher';
    type AddStitchButtonData = {
        name: string;
        hovertext: string;
        disabled: boolean;
    };
    const renderAddStitchButtons: AddStitchButtonData[] = [
        {
            name: 'ch',
            hovertext: 'chain',
            disabled: false,
        },
        {
            name: 'ss',
            hovertext: 'slip stitch',
            disabled: false,
        },
        {
            name: 'st',
            hovertext: 'stitch',
            disabled: false,
        },
        {
            name: 'sc',
            hovertext: 'single crochet',
            disabled: false,
        },
        {
            name: 'dc',
            hovertext: 'double crochet',
            disabled: false,
        },
        {
            name: 'hdc',
            hovertext: 'half double crochet',
            disabled: false,
        },
        {
            name: 'tc',
            hovertext: 'treble crochet',
            disabled: false,
        },
        {
            name: 'inc',
            hovertext: 'increase',
            disabled: true,
        },
        {
            name: 'inv',
            hovertext: 'invisible',
            disabled: true,
        },
        {
            name: 'dec',
            hovertext: 'decrease',
            disabled: true,
        },
        {
            name: 'sp',
            hovertext: 'space',
            disabled: true,
        },
        {
            name: 'mr',
            hovertext: 'magic ring',
            disabled: false,
        },
        {
            name: 'in',
            hovertext: 'into',
            disabled: true,
        },
        {
            name: 'next',
            hovertext: 'next',
            disabled: true,
        },
        {
            name: 'from',
            hovertext: 'from',
            disabled: true,
        },
        {
            name: 'two',
            hovertext: 'twice',
            disabled: true,
        },
        {
            name: 'three',
            hovertext: 'thrice',
            disabled: true,
        },
        {
            name: 'time',
            hovertext: 'times',
            disabled: true,
        },
        {
            name: 'more',
            hovertext: 'more',
            disabled: true,
        },
        {
            name: 'rep',
            hovertext: 'repeat',
            disabled: true,
        },
    ];
    function sendToParser() {
        try {
            parse($textContent);
            textContentError.set({
                errorText: $textContent.length > 0 ? '✅ Valid pattern.' : '',
                errorValue: false,
            });
        } catch (error) {
            textContentError.set({
                errorText: '❌ ' + error + '.',
                errorValue: true,
            });
        }
    }
    function appendStitch(e: any) {
        let stitchText = e.target.textContent as string;
        textContent.update((currentText: string) => currentText + ' ' + stitchText);
        sendToParser();
    }
</script>

<Panel --left="1vw">
    <div slot="panel-title">
        <h4 class="h4">Pattern</h4>
    </div>
    <div slot="panel-elements">
        <textarea
            id="editor_textarea"
            class="textarea rounded-lg p-1"
            rows="4"
            placeholder="Begin by entering your crochet pattern here!"
            bind:value={$textContent}
            on:input={sendToParser}
            on:change={sendToParser}
        ></textarea>
        <p class={$textContentError.errorValue ? 'text-error-500' : 'text-success-500'}>
            {$textContentError.errorText}
        </p>
        <br />
        <p>Add Stitches / Instructions:</p>
        <div id="add-stitch-buttons" class="flex flex-wrap gap-1">
            {#each renderAddStitchButtons as stitch}
                <button
                    class={'btn-sm rounded-lg '.concat(
                        stitch.disabled == true
                            ? 'variant-ghost-surface'
                            : 'variant-filled-surface',
                    )}
                    title={stitch.hovertext}
                    disabled={stitch.disabled}
                    on:click={appendStitch}
                >
                    {stitch.name}
                </button>
            {/each}
        </div>
        <br />
        <p>Next Stitch Colour:</p>
        <input
            id="EditorColorInput"
            type="color"
            class="rounded-lg"
            bind:value={$nextStitchColourValue}
        />
    </div>
</Panel>

<style>
    #EditorColorInput {
        cursor: pointer;
    }
    button {
        display: block;
        margin-bottom: 10px;
    }
</style>

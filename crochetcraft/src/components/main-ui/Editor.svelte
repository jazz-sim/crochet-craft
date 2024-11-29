<script lang="ts">
    import { uploadTextContent, generalTextContent } from './stores';
    import Panel from '$components/option-panel/Panel.svelte';
    let editorTextArea: HTMLTextAreaElement;
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
    function setLocalInput(e: any) {
        console.log('Did this run???');
        console.log(e.target.textContent);
        uploadTextContent.set(e.target.textContent);
        console.log($uploadTextContent);
    }
    uploadTextContent.subscribe((value) => {
        console.log('In here...');
        if (editorTextArea) {
            console.log('In here????');
            editorTextArea.textContent = value;
            console.log(value);
            console.log(editorTextArea.textContent);
        }
    });
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
            on:input={setLocalInput}
            bind:this={editorTextArea}
        />
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
                >
                    {stitch.name}
                </button>
            {/each}
        </div>
        <p>Next Stitch Colour:</p>
        <input type="color" value="#ff0000" />
    </div>
</Panel>

<style>
    button {
        display: block;
        margin-bottom: 10px;
    }
</style>

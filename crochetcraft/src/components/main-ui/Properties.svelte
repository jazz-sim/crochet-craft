<script lang="ts">
    import Panel from '$components/option-panel/Panel.svelte';
    import { nextStitchColourValue, selected3DObject } from './stores';
    import { Material, MeshLambertMaterial } from 'three';
    // Initializing variables:
    let stitchLaxityValue = 0;
    let stitchLaxityRegex = '(0|1)(.[0-9]{1,2})?';
    let hookSizeValue = 5;
    let stitchThicknessValue = 5;
    let hookAndThicknessRegex = '[5-9]|1[0-9]|2[0-5]';
    // Setting up elements:
    let laxityTextInput: HTMLInputElement;
    let hookSizeTextInput: HTMLInputElement;
    let stitchThicknessTextInput: HTMLInputElement;
    // Checking input mismatches:
    function checkMismatch(type: String) {
        let selectedTextInput = laxityTextInput;
        if (type === 'hook') {
            selectedTextInput = hookSizeTextInput;
        } else if (type === 'thickness') {
            selectedTextInput = stitchThicknessTextInput;
        }
        const validityState = selectedTextInput.validity;
        if (validityState.patternMismatch) {
            if (type === 'laxity') {
                selectedTextInput.setCustomValidity(
                    'Only values between 0 and 1.5 with a step of 0.01 are allowed.',
                );
            } else {
                selectedTextInput.setCustomValidity('Only integers between 5 and 25 are allowed.');
            }
        } else {
            selectedTextInput.setCustomValidity('');
        }
    }
    // Changing stitch colour:
    function updateStitchColour(e: any) {
        if ($selected3DObject) {
            ($selected3DObject.material as MeshLambertMaterial).color.setHex(
                parseInt(e.target?.value.replace('#', '0x')),
            );
        }
    }
</script>

<Panel --left="calc(99vw - 400px)" --display={$selected3DObject !== null ? 'unset' : 'none'}>
    <div slot="panel-title">
        <h4 class="h4">Properties</h4>
    </div>
    <div slot="panel-elements">
        <p>Stitch Laxity:</p>
        <div class="input-group input-group-divider grid-cols-5 rounded-lg">
            <input
                bind:value={stitchLaxityValue}
                id="stitchLaxitySlider"
                type="range"
                min="0"
                step="0.01"
                max="1.5"
                class="col-span-4 h-7"
            />
            <input
                type="text"
                class="col-span-1 h-7 w-1"
                maxlength="4"
                bind:this={laxityTextInput}
                bind:value={stitchLaxityValue}
                pattern={stitchLaxityRegex}
                on:input={() => checkMismatch('laxity')}
            />
        </div>
        <br />
        <p>Stitch Hooksize (in mm):</p>
        <div class="input-group input-group-divider grid-cols-5 rounded-lg">
            <input
                bind:value={hookSizeValue}
                id="stitchLaxitySlider"
                type="range"
                min="5"
                step="1"
                max="25"
                class="col-span-4 h-7"
            />
            <input
                type="text"
                class="col-span-1 h-7"
                maxlength="4"
                bind:this={hookSizeTextInput}
                bind:value={hookSizeValue}
                pattern={hookAndThicknessRegex}
                on:input={() => checkMismatch('hook')}
            />
        </div>
        <br />
        <p>Stitch Thickness (in mm):</p>
        <div class="input-group input-group-divider grid-cols-5 rounded-lg">
            <input
                bind:value={stitchThicknessValue}
                id="stitchLaxitySlider"
                type="range"
                min="5"
                step="1"
                max="25"
                class="col-span-4 h-7"
            />
            <input
                type="text"
                class="input-group-shim col-span-1 h-7"
                maxlength="4"
                bind:this={stitchThicknessTextInput}
                bind:value={stitchThicknessValue}
                pattern={hookAndThicknessRegex}
                on:input={() => checkMismatch('thickness')}
            />
        </div>
        <br />
        <p>Stitch Colour:</p>
        {#if $selected3DObject !== null}
            <input
                type="color"
                class="rounded-lg"
                value={$selected3DObject !== null
                    ? '#'.concat(
                          ($selected3DObject.material as MeshLambertMaterial).color.getHexString(),
                      )
                    : $nextStitchColourValue}
                on:change={updateStitchColour}
            />
        {/if}
    </div>
</Panel>

<style>
    input:invalid {
        border: red solid 3px;
    }
</style>

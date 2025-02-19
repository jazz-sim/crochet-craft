import { Foundation, LinkedStitch, ParsedInstruction, Pattern, StitchType } from '../types.js';

export function link(input: Pattern<ParsedInstruction>): Pattern<LinkedStitch> {
    // Note that the input contains instructions other than stitches, like
    // 'turn'. These do not exist in the linked output, so each stitch has two
    // separate indices. The 'input index' is its index in `input.stitches`, and
    // the 'output index' is the index in `output`.

    // The output stitches.
    const output: LinkedStitch[] = input.stitches
        .filter((instr) => typeof instr !== 'string')
        .map((stitch) => ({
            location: stitch.location,
            type: stitch.type,
            colour: stitch.colour,
            parents: null,
            children: [],
        }));

    // Whether or not we are currently crocheting into the magic ring.
    let isInMagicRing = input.foundation === Foundation.MagicRing;

    let rows = []
    // The stitches in the previous row. Array of output indices.
    let previousRow: number[] = [];
    // The stitches in the current row. Array of output indices.
    let currentRow: number[] = [];
    // The stitches in the current row, stored as LinkedStitch
    let currentRowLS: LinkedStitch[] = [];

    // Index of the next element of `previousRow` to link to.
    let previousIndex = 0;

    let outputIndex = 0;
    for (let inputIndex = 0; inputIndex < input.stitches.length; inputIndex++) {
        const instruction = input.stitches[inputIndex];
        if (instruction === 'turn') {
            previousIndex = 0;
            previousRow = currentRow.reverse();
            rows.push(currentRowLS);
            currentRowLS = [];
            currentRow = [];
        } else if (instruction === 'eor') {
            isInMagicRing = false;
        } else {
            const stitch = instruction;

            if (stitch.type !== StitchType.Chain && !isInMagicRing) {
                // This stitch needs a parent
                previousIndex += stitch.parentOffset;
                if (previousIndex >= previousRow.length) {
                    // Overran the end of the previous row, so restart in the current row.
                    previousIndex -= previousRow.length;
                    previousRow = currentRow;
                    currentRow = [];
                    if (!previousRow.length) {
                        // Nothing in the previous row?!
                        throw new Error(`No stitch to link to, for stitch ${outputIndex + 1}`);
                    }
                } else if (previousIndex < 0) {
                    throw new Error(`No previous stitch to link to, for stitch ${outputIndex + 1}`);
                }

                if (previousRow[previousIndex] === outputIndex - 1) {
                    // Cannot link a stitch to its previous one. Skip this parent.
                    previousIndex += 1;
                    if (previousIndex >= previousRow.length) {
                        throw new Error(
                            `Cannot link a stitch to its previous, for stitch ${outputIndex + 1}`,
                        );
                    }
                }
                if (output[outputIndex].parents == null) {
                    output[outputIndex].parents = [previousRow[previousIndex]];
                }
                else {
                    output[outputIndex].parents?.push(previousRow[previousIndex]);
                }
                output[previousRow[previousIndex]].children.push(outputIndex);
                previousIndex += 1 + stitch.parentOffset;
            }
            currentRowLS.push(output[outputIndex]);
            currentRow.push(outputIndex);
            outputIndex += 1;
        }
    }
    rows.push(currentRowLS);

    return {
        foundation: input.foundation,
        stitches: output,
        rows: rows
    };
}

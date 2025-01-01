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
            parent: null,
        }));

    // Whether or not we are currently crocheting into the magic ring.
    let isInMagicRing = input.foundation === Foundation.MagicRing;

    // The stitches in the previous row. Array of output indices.
    let previousRow: number[] = [];
    // The stitches in the current row. Array of output indices.
    let currentRow: number[] = [];

    // Index of the next element of `previousRow` to link to.
    let previousIndex = 0;

    let outputIndex = 0;
    for (let inputIndex = 0; inputIndex < input.stitches.length; inputIndex++) {
        const instruction = input.stitches[inputIndex];
        if (instruction === 'turn') {
            previousIndex = 0;
            previousRow = currentRow.reverse();
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

                output[outputIndex].parent = previousRow[previousIndex];
                previousIndex += 1 + stitch.parentOffset;
            }

            currentRow.push(outputIndex);
            outputIndex += 1;
        }
    }

    return {
        foundation: input.foundation,
        stitches: output,
    };
}

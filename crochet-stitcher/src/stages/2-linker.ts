import {
    Foundation,
    LinkedStitch,
    ParsedInstruction,
    Pattern,
    RowEnding,
    StitchType,
} from '../types.js';

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

    const rows = [];
    const endings: RowEnding[] = [];

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
            endings.push(RowEnding.Turn);
            currentRowLS = [];
            currentRow = [];
        } else if (instruction === 'eor') {
            isInMagicRing = false;
        } else {
            const stitch = instruction;

            if (stitch.type !== StitchType.Chain && !isInMagicRing) {
                // This stitch needs parent(s)
                previousIndex += stitch.parentOffset;
                output[outputIndex].parents ??= [];

                const numParents = stitch.type === StitchType.Sc2tog ? 2 : 1;
                for (let whichParent = 0; whichParent < numParents; ++whichParent) {
                    if (previousIndex >= previousRow.length) {
                        // Overran the end of the previous row, so restart in the current row.
                        previousIndex -= previousRow.length;
                        previousRow = currentRow;
                        rows.push(currentRowLS);
                        endings.push(RowEnding.LoopAround);
                        currentRowLS = [];
                        currentRow = [];
                        if (!previousRow.length) {
                            // Nothing in the previous row?!
                            throw new Error(`No stitch to link to, for stitch ${outputIndex + 1}`);
                        }
                    } else if (previousIndex < 0) {
                        throw new Error(
                            `No previous stitch to link to, for stitch ${outputIndex + 1}`,
                        );
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
                    output[outputIndex].parents!.push(previousRow[previousIndex]);
                    output[previousRow[previousIndex]].children.push(outputIndex);
                    previousIndex += 1;
                }
            }
            currentRowLS.push(output[outputIndex]);
            currentRow.push(outputIndex);
            outputIndex += 1;
        }
    }
    rows.push(currentRowLS);
    if (endings.length > 0) {
        endings.push(endings[endings.length - 1]);
    } else {
        endings.push(RowEnding.Turn);
    }

    return {
        foundation: input.foundation,
        stitches: output,
        rows,
        endings,
    };
}

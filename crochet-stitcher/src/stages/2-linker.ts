import { LinkedStitch, ParsedStitch, Pattern, StitchType } from '../types.js';

interface LinkedStitchIntermediate {
    stitch: LinkedStitch;
    globalIndex: number;
}

export function link(input: Pattern<ParsedStitch>): Pattern<LinkedStitch> {
    let previous: LinkedStitchIntermediate[] = [];
    let current: LinkedStitchIntermediate[] = [];

    let stitches: LinkedStitchIntermediate[] = [];
    let parsedList = input.stitches;

    // For starting off, we need to 'seed' the current row before we get to the general pattern
    // TODO: DO ABOVE

    // General pattern - add stitches to the current row
    // If you end the row with a turnaround, reverse the previous row
    // If you don't just add parents one by one
    let prevPtr = 0;
    let totalIndex = 0;
    for (let i = 0; i < parsedList.length; i++) {
        let type = parsedList[i].type;
        let count = parsedList[i].repeat;

        //
        // Chain stitches have no parent
        if (type == StitchType.Chain) {
            for (let j = 0; j < count; j++) {
                current.push({ stitch: { type: type, parent: null }, globalIndex: totalIndex });
                totalIndex += 1;
            }
        } else {
            for (let j = 0; j < count; j++) {
                current;
                totalIndex += 1;
            }
        }
    }

    let trimmedStitches: LinkedStitch[] = [];
    for (let i = 0; i < stitches.length; i++) {
        trimmedStitches.push(stitches[i].stitch);
    }
    return { foundation: input.foundation, stitches: trimmedStitches };
}

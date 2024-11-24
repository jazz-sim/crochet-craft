import { LinkedStitch, ParsedInstruction, ParsedStitch, Pattern, StitchType } from '../types.js';

interface LinkedStitchIntermediate {
    stitch: LinkedStitch;
    globalIndex: number;
}

export function link(input: Pattern<ParsedInstruction>): Pattern<LinkedStitch> {
    let previous: LinkedStitchIntermediate[] = [];
    let current: LinkedStitchIntermediate[] = [];

    let stitches: LinkedStitchIntermediate[] = [];
    let parsedList = input.stitches;
    let prevPtr = 0;
    let totalIndex = 0;
    let baseIndex = 0;
    // For starting off, we need to 'seed' the current row before we get to the general pattern
    for (let i = 0; i < parsedList.length; i++) {
        if (parsedList[i] === 'turn' || parsedList[i] === 'eor') {
            break;
        } else {
            let item = parsedList[i] as ParsedStitch;
            let type = item.type;
            let colour = item.colour;
            let offset = item.parentOffset;
            // Chain stitches have no parent
            if (type == StitchType.Chain) {
                previous.push({
                    stitch: { type: type, colour: colour, parent: null },
                    globalIndex: totalIndex,
                });
                stitches.push({
                    stitch: { type: type, colour: colour, parent: null },
                    globalIndex: totalIndex,
                });
                totalIndex += 1;
                baseIndex += 1;
            } else {
                // I think the index is right here??
                current.push({
                    stitch: { type: type, colour: colour, parent: totalIndex - 1 },
                    globalIndex: totalIndex,
                });
                stitches.push({
                    stitch: { type: type, colour: colour, parent: totalIndex - 1 },
                    globalIndex: totalIndex,
                });
                baseIndex += 1;
                totalIndex += 1;
            }
        }
    }

    // General pattern - add stitches to the current row
    // If you end the row with a turnaround, reverse the previous row
    // If you don't just add parents one by one

    for (let i = baseIndex; i < parsedList.length; i++) {
        if (parsedList[i] === 'turn' || parsedList[i] === 'eor') {
            //swap lists if at the end of previous

            // Don't need conditional since we're for sure at the end of the row
            // if (prevPtr == previous.length) {
            previous = current;
            // weird but apparently valid
            current.length = 0;
            if (parsedList[i] === 'turn') {
                // If turning around - need conditional!
                previous.reverse();
            }
            prevPtr = 0;
            // }
        } else {
            let item = parsedList[i] as ParsedStitch;
            let type = item.type;
            let colour = item.colour;
            let offset = item.parentOffset;
            // Chain stitches have no parent
            if (type == StitchType.Chain) {
                current.push({
                    stitch: { type: type, colour: colour, parent: null },
                    globalIndex: totalIndex,
                });
                stitches.push({
                    stitch: { type: type, colour: colour, parent: null },
                    globalIndex: totalIndex,
                });
                totalIndex += 1;
            } else {
                // Should always be valid? Double check this
                let parent = previous[prevPtr + offset];
                let parentIndex = parent.globalIndex;
                current.push({
                    stitch: { type: type, colour: colour, parent: parentIndex },
                    globalIndex: totalIndex,
                });
                stitches.push({
                    stitch: { type: type, colour: colour, parent: parentIndex },
                    globalIndex: totalIndex,
                });
                prevPtr += offset + 1;
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

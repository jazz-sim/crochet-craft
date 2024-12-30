import { ParsedStitch, StitchType } from '../src/types.js';

/** A shortcut to create a repeated parsed stitch. */
export function st(
    type: StitchType,
    repeat = 1,
    parentOffset = 0,
    colour = 'white',
): ParsedStitch[] {
    return Array(repeat).fill({
        type,
        colour,
        into: null,
        parentOffset,
    });
}

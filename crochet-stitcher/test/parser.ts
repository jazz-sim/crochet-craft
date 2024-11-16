import { StitchType, ParsedStitch } from '../src/types.js';

/** A shortcut to create a parsed stitch. */
export function st(type: StitchType, repeat = 1, colour = 'white'): ParsedStitch {
    return { type, repeat, colour, into: null };
}

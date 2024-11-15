import { Pattern, Foundation, StitchType, ParsedStitch } from '../src/types.js';

/** A shortcut to create a slip-knot pattern. */
export function slkt<T>(...stitches: T[]): Pattern<T> {
    return { foundation: Foundation.SlipKnot, stitches };
}

/** A shortcut to create a magic-ring pattern. */
export function mc<T>(...stitches: T[]): Pattern<T> {
    return { foundation: Foundation.MagicRing, stitches };
}

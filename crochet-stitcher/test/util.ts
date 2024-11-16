import { Pattern, Foundation } from '../src/types.js';

/** A shortcut to create a slip-knot pattern. */
export function slkt<T>(...stitches: T[]): Pattern<T extends readonly (infer U)[] ? U : T> {
    return { foundation: Foundation.SlipKnot, stitches: stitches.flat() };
}

/** A shortcut to create a magic-ring pattern. */
export function mc<T>(...stitches: T[]): Pattern<T extends readonly (infer U)[] ? U : T> {
    return { foundation: Foundation.MagicRing, stitches: stitches.flat() };
}

import { Pattern, Foundation } from '../src/types.js';

export type MaybeArray<T> = T | MaybeArray<T>[];

/** A shortcut to create a slip-knot pattern. */
export function slkt<T>(...stitches: MaybeArray<T>[]): Pattern<T> {
    return { foundation: Foundation.SlipKnot, stitches: (stitches as any[]).flat(Infinity) };
}

/** A shortcut to create a magic-ring pattern. */
export function mc<T>(...stitches: MaybeArray<T>[]): Pattern<T> {
    return { foundation: Foundation.MagicRing, stitches: (stitches as any[]).flat(Infinity) };
}

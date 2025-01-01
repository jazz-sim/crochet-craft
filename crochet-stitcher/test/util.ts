import { Foundation, Location, Pattern } from '../src/types.js';

export type MaybeArray<T> = T | MaybeArray<T>[];
export type NoLocation<T> = Omit<T, 'location'>;

/** A shortcut to create a slip-knot pattern. */
export function slkt<T>(...stitches: MaybeArray<NoLocation<T>>[]): Pattern<T> {
    return { foundation: Foundation.SlipKnot, stitches: formatStitches(stitches) };
}

/** A shortcut to create a magic-ring pattern. */
export function mc<T>(...stitches: MaybeArray<NoLocation<T>>[]): Pattern<T> {
    return { foundation: Foundation.MagicRing, stitches: formatStitches(stitches) };
}

function formatStitches<T>(stitches: MaybeArray<NoLocation<T>>[]): T[] {
    return (stitches as any[]).flat(Infinity).map((stitch) => {
        if (typeof stitch !== 'object') return stitch;
        return {
            // If location is not specified, then just expect any location.
            location: expect.any(Location),
            ...stitch,
        };
    });
}

import { LinkedStitch, StitchType } from '../src/types';

/** A shortcut to create a linked stitch. */
export function lst(
    type: StitchType,
    parent: number | null = null,
    colour = 'white',
): LinkedStitch {
    return { type, parent, colour };
}

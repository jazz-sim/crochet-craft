import { LinkedStitch, StitchType } from '../src/types';
import { NoLocation } from './util';

/** A shortcut to create a linked stitch. */
export function lst(
    type: StitchType,
    parent: number | null = null,
    colour = 'white',
): NoLocation<LinkedStitch> {
    return { type, parent, colour };
}

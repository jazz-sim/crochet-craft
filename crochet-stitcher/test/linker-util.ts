import { LinkedStitch, StitchType } from '../src/types';
import { NoLocation } from './util';

/** A shortcut to create a linked stitch. */
export function lst(
    type: StitchType,
    parents: number[] | null = null,
    children: number[] = [],
    colour = 'white',
): NoLocation<LinkedStitch> {
    return { type, parents, children, colour };
}

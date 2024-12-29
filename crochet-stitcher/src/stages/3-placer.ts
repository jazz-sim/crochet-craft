import { Vector3 } from 'three';
import { LinkedStitch, Pattern, PlacedStitch } from '../types.js';
import { naivePlacer } from './3-placer/naivePlacerEstimator.js';

export function place(input: Pattern<LinkedStitch>): Pattern<PlacedStitch> {
    const initialPlacement = naivePlacer(input);

    return {
        foundation: input.foundation,
        stitches: initialPlacement,
    };
}

// Scuffed export for use in experiments
export { evaluateForces } from './3-placer/iterativeForcing.js';

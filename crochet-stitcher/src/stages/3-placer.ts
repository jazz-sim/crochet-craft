import { LinkedStitch, Pattern, PlacedStitch } from '../types.js';
import { iterateForces } from './3-placer/iterativeForcing.js';
import { naivePlacer } from './3-placer/naivePlacerEstimator.js';
import { setOrientations } from './3-placer/orientationSetter.js';

export function place(input: Pattern<LinkedStitch>): Pattern<PlacedStitch> {
    // Use naive placer for initial positioning of stitches
    const initialPlacement = naivePlacer(input);
    // Apply forces to move stitches into more reasonable positions
    const postForcePlacement = iterateForces({
        foundation: input.foundation,
        stitches: initialPlacement,
    });

    const orientedPlacement = setOrientations(postForcePlacement);

    return orientedPlacement;
}

// Scuffed export for use in experiments
export { gdPlace } from './3-placer/gd-placer.js';
export { evaluateForces } from './3-placer/iterativeForcing.js';

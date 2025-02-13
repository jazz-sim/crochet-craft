import { Quaternion, Vector3 } from 'three';
import { Pattern, PlacedStitch } from '../../types';

const X_AXIS = new Vector3(1, 0, 0);

/**
 * Sets orientation of stitches based on the position of the following stitch.
 * This will mutate the input pattern.
 */
export function setOrientations(pattern: Pattern<PlacedStitch>): Pattern<PlacedStitch> {
    const numStitches = pattern.stitches.length;

    for (let i = 0; i < numStitches - 1; ++i) {
        pattern.stitches[i].orientation = rotationToDirection(
            X_AXIS,
            pattern.stitches[i + 1].position.clone().sub(pattern.stitches[i].position),
        );
    }
    if (numStitches > 1) {
        pattern.stitches[numStitches - 1].orientation =
            pattern.stitches[numStitches - 2].orientation;
    }

    return pattern;
}

/**
 * Computes the quaternion to rotate from one direction to another.
 * Input vectors are treated as directions, but do not need to be normalized.
 *
 * @param from the initial direction
 * @param to the target direction
 */
function rotationToDirection(from: Vector3, to: Vector3): Quaternion {
    return new Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize());
}

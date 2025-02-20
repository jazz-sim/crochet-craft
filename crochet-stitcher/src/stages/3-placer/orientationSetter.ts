import { Quaternion, Vector3 } from 'three';
import { Pattern, PlacedStitch } from '../../types';

const X_AXIS = new Vector3(1, 0, 0);
const NEG_X_AXIS = new Vector3(-1, 0, 0);

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
    // If the target direction is in the negative x-direction, we define the orientation as a
    // combination of two rotations, since using a single rotation would flip the stitch upside down:
    // 1. Rotation around the Y axis to the -x direction
    // 2. Rotation from the -x direction to the actual target
    if (to.x < 0) {
        // Quaternion multiplication is actually right to left, so the rotations are defined in reverse order here
        return new Quaternion().multiplyQuaternions(
            new Quaternion().setFromUnitVectors(NEG_X_AXIS, to.clone().normalize()),
            // We could explicitly define a rotation around the Y axis using .setFromAxisAngle()
            // since we should only ever call this with from = X_AXIS, but just in case from is something different,
            // this should still work.
            // (For some reason, setFromUnitVectors choose a "nice" axis of rotation for this case)
            new Quaternion().setFromUnitVectors(from.normalize(), NEG_X_AXIS),
        );
    }

    return new Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize());
}

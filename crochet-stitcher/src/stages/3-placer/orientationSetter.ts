import { Matrix4, Quaternion, Vector3 } from 'three';
import { Pattern, PlacedStitch, StitchType } from '../../types';

const X_AXIS = new Vector3(1, 0, 0);
const NEG_X_AXIS = new Vector3(-1, 0, 0);
const IDENTITY = new Quaternion();

/**
 * Sets orientation of stitches based on the position of the following stitch.
 * This will mutate the input pattern.
 */
export function setOrientations(pattern: Pattern<PlacedStitch>): Pattern<PlacedStitch> {
    for (let i = 0; i < pattern.stitches.length; ++i) {
        pattern.stitches[i].orientation = computeOrientation(pattern, i);
    }
    return pattern;
}

function computeOrientation(pattern: Pattern<PlacedStitch>, i: number): Quaternion {
    const stitch = pattern.stitches[i];
    let previous: PlacedStitch | null = pattern.stitches[i - 1];
    let next: PlacedStitch | null = pattern.stitches[i + 1];
    // Ignore chains when computing X orientation, except when both previous and
    // next are chains, then just keep the next one.
    if (previous?.type === StitchType.Chain) previous = null;
    else if (next?.type === StitchType.Chain) next = null;

    // Compute stitch's local X axis
    let localX: Vector3;
    if (previous && next) {
        // (next - cur) * 9 + (cur - prev)
        localX = next.position
            .clone()
            .sub(stitch.position)
            .multiplyScalar(9)
            .add(stitch.position)
            .sub(previous.position);
    } else if (previous) {
        localX = stitch.position.clone().sub(previous.position);
    } else if (next) {
        localX = next.position.clone().sub(stitch.position);
    } else {
        return IDENTITY; // only 1 stitch in the whole pattern :flushed: forget about it
    }
    localX.normalize();

    // Compute stitch's local Y axis
    const localY = new Vector3();
    if (stitch.parents) {
        for (const parent of stitch.parents) {
            localY.sub(pattern.stitches[parent].position);
        }
    }
    for (const child of stitch.children) {
        localY.add(pattern.stitches[child].position);
    }
    const numParents = stitch.parents?.length ?? 0;
    const numChildren = stitch.children.length;
    if (!numParents && !numChildren) {
        localY.y = 1; // default value if no parents or children
    } else {
        localY.add(stitch.position.clone().multiplyScalar(numParents - numChildren));
    }

    // Compute stitch's local Z axis
    const localZ = localX.clone().cross(localY).normalize();

    // Ensure localY is perpendicular
    localY.crossVectors(localZ, localX);

    return new Quaternion().setFromRotationMatrix(
        // prettier-ignore
        new Matrix4(
            localX.x, localY.x, localZ.x, 0,
            localX.y, localY.y, localZ.y, 0,
            localX.z, localY.z, localZ.z, 0,
            0, 0, 0, 0,
        ),
    );
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

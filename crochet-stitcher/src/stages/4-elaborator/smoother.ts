import { PatternIR, StitchIR } from './ir';

export function smoothConnections(pattern: PatternIR): PatternIR {
    return {
        foundation: pattern.foundation,
        stitches: pattern.stitches.map((stitch, index, arr) => {
            if (
                !stitch.model ||
                index == 0 ||
                !(stitch.model.curveType == 'bezier' && arr[index - 1].model?.curveType == 'bezier')
            ) {
                return stitch;
            }
            return startToEndFixer(stitch, arr[index - 1]);
        }),
    };
}

/**
 * Sets the starting point of `nextStitch` to the ending point of `prevStitch`,
 * and modifies the first anchor of `nextStitch` to be aligned with the
 * last anchor of `prevStitch`.
 *
 * This ensures (bezier-curve based) stitches are continuous, and first-derivative continuous.
 *
 * @param nextStitch the stitch whose starting point to modify ("fix")
 * @param prevStitch the stitch whose ending point is used to modify `nextStitch`
 */
function startToEndFixer(nextStitch: StitchIR, prevStitch: StitchIR): StitchIR {
    // If for some reason, we don't have a model attached, give up.
    if (!nextStitch.model || !prevStitch.model) {
        return nextStitch;
    }

    // Move start of next stitch to end of next
    const endOfPrevStitch = prevStitch.model.points[prevStitch.model.points.length - 1];
    // Deep copy to prevent reference jank
    nextStitch.model.points[0] = {
        x: prevStitch.position.x - nextStitch.position.x + endOfPrevStitch.x,
        y: prevStitch.position.y - nextStitch.position.y + endOfPrevStitch.y,
        z: prevStitch.position.z - nextStitch.position.z + endOfPrevStitch.z,
    };

    // Reorient first anchor for continuity
    // On the one hand, this does make the chain stitch look much better.
    // On the other, this is a lot of work to fix an issue with the original base model.
    // (...which is my fault for the record - Allen)
    // But on the other other hand, it's unreasonable for every base model to end in the same direction.

    // Project the first pivot along the line that the last stitch's final point and pivot lie on.
    const prevAnchor = prevStitch.model.points[prevStitch.model.points.length - 2];
    const prevAnchorDiff = {
        x: endOfPrevStitch.x - prevAnchor.x,
        y: endOfPrevStitch.y - prevAnchor.y,
        z: endOfPrevStitch.z - prevAnchor.z,
    };
    const nextAnchorDiff = {
        x: nextStitch.model.points[1].x - nextStitch.model.points[0].x,
        y: nextStitch.model.points[1].y - nextStitch.model.points[0].y,
        z: nextStitch.model.points[1].z - nextStitch.model.points[0].z,
    };
    const distSquared = Math.sqrt(
        prevAnchorDiff.x * prevAnchorDiff.x +
            prevAnchorDiff.y * prevAnchorDiff.y +
            prevAnchorDiff.z * prevAnchorDiff.z,
    );
    const dotProduct =
        prevAnchorDiff.x * nextAnchorDiff.x +
        prevAnchorDiff.y * nextAnchorDiff.y +
        prevAnchorDiff.z * nextAnchorDiff.z;
    // If the dot product is negative, this leads to... weird results
    // (i.e. non-smooth zigzags)
    const multiplier = distSquared / Math.abs(dotProduct);

    // Modify the first anchor to be aligned in the same direction as the
    // last anchor of the previous stitch.
    nextStitch.model.points[1] = {
        x: nextStitch.model.points[0].x + prevAnchorDiff.x * multiplier,
        y: nextStitch.model.points[0].y + prevAnchorDiff.y * multiplier,
        z: nextStitch.model.points[0].z + prevAnchorDiff.z * multiplier,
    };

    return nextStitch;
}

import { Vector3 } from 'three';
import { PatternIR, StitchIR } from './ir';

export function smoothConnections(pattern: PatternIR): PatternIR {
    console.log('Smoother Start!');
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
        console.error(
            '[elaborator/smoother] No model associated with at least one of the following stitches!',
            nextStitch,
            prevStitch,
        );
        return nextStitch;
    }

    const endOfPrevStitch = prevStitch.model.points[prevStitch.model.points.length - 1];
    const prevAnchor = prevStitch.model.points[prevStitch.model.points.length - 2];
    const startOfNextStitch = nextStitch.model.points[0];
    const nextAnchor = nextStitch.model.points[1];

    // Move start of next stitch to end of next
    nextStitch.model.points[0] = prevStitch.position
        .clone()
        .sub(nextStitch.position)
        .add(endOfPrevStitch);

    // Reorient first anchor for continuity
    // On the one hand, this does make the chain stitch look much better.
    // On the other, this is a lot of work to fix an issue with the original base model.
    // (...which is my fault for the record - Allen)
    // But on the other other hand, it's unreasonable for every base model to end in the same direction.

    // Get relative difference between the points at the end/start of the pre/next stitch, and the prev/next anchor
    const prevAnchorDiff = endOfPrevStitch.clone().sub(prevAnchor);
    const nextAnchorDiff = nextAnchor.clone().sub(startOfNextStitch);

    // Project the first pivot along the line that the last stitch's final point and pivot lie on.
    const projection = nextAnchorDiff.projectOnVector(prevAnchorDiff);

    // Move anchor based on projection and dot product between anchor differences
    // The dot product if statement prevents sharp bends from ocurring (i.e. 180 degree turns)
    nextStitch.model.points[1] = nextStitch.model.points[0].clone();
    if (nextAnchorDiff.dot(prevAnchorDiff) > 0) {
        nextStitch.model.points[1].add(projection);
    } else {
        nextStitch.model.points[1].sub(projection);
    }

    return nextStitch;
}

/**
 * The copy-paste elaborator is an extremely simple initial step for the elaborator
 * which simply copies the points that make up a stitch into the position and orientation
 * provided by the placer.
 *
 * No additional work is done to make the resulting stitches look "nice".
 */
import { Vector3 } from 'three';

import StitchModel from '../../models';
import { Pattern, PlacedStitch, StitchType } from '../../types';
import { PatternIR, StitchIR } from './ir';
import { arrayToVector3List } from './vectorHelper';

/**
 * Replaces placed stitches with a set of geometries corresponding to
 * how each stitch would actually look.
 *
 * This only "copy-pastes" from a template, so there is no
 * awareness of distortion, compression, etc.
 * @param placedStitches
 * @returns
 */
export function copyPasteStitches(placedStitches: Pattern<PlacedStitch>): PatternIR {
    return {
        foundation: placedStitches.foundation,
        stitches: placedStitches.stitches
            // "Copy-paste" step; for each placed stitch,
            // add the points from the base model corresponding to its type
            .map((stitch) => {
                const model = substituteStitch(stitch);
                return {
                    ...stitch,
                    model: {
                        curveType: model.curveType,
                        points: arrayToVector3List(model.points),
                    },
                };
            })
            .map(rotatePoints),
    };
}

/**
 * Helper function to get the stitch model for a given placed stitch.
 *
 * @param stitch
 * @returns
 */
function substituteStitch(stitch: PlacedStitch): StitchModel {
    switch (stitch.type) {
        case StitchType.Chain:
            return StitchModel.CHAIN;
        case StitchType.Single:
            return StitchModel.SINGLE_CROCHET;
        default:
            throw 'Unsupported stitch!';
    }
}

/**
 * Returns a stitch with the points within a model rotated according to the stitch's orientation quaternion.
 * This assumes the model is aligned along the +x axis prior to rotation.
 */
function rotatePoints(stitch: StitchIR): StitchIR {
    // Slight jank due to nested IR structure
    // Basically, if there is a model, we rotate all of the points around the center position
    return {
        ...stitch,
        model: stitch.model
            ? {
                  ...stitch.model,
                  points: stitch.model.points.map((point) => {
                      return (
                          point
                              // Deep copy to prevent unexpected jank
                              // If we're *certain* we won't be using the pre-rotation stitches for anything,
                              // this can be safely removed for some extra performance.
                              .clone()
                              // FYI This is the only part that does the rotation,
                              .applyQuaternion(stitch.orientation)
                              // Cursed multiplication by 2 because the placer thinks stitches
                              // are twice as big as the stitch model is
                              .multiplyScalar(2)
                      );
                  }),
              }
            : undefined,
    };
}

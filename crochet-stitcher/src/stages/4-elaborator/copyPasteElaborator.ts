/**
 * The copy-paste elaborator is an extremely simple initial step for the elaborator
 * which simply copies the points that make up a stitch into the position and orientation
 * provided by the placer.
 *
 * No additional work is done to make the resulting stitches look "nice".
 */
import { Quaternion, Vector3 } from 'three';

import StitchModel from '../../models';
import { Foundation, Pattern, PlacedStitch, StitchType } from '../../types';
import { PatternIR, StitchIR } from './ir';
import { arrayToVector3List } from './vectorHelper';
import { DEFAULT_COLOUR } from '../../constants';

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
    const { foundation, stitches } = placedStitches;
    const placedFoundationStitch = {
        type: foundationToStitch(foundation),
        colour: stitches.length ? stitches[0].colour : DEFAULT_COLOUR,
        position: foundationOffset(
            foundation,
            stitches.length ? stitches[0].position : new Vector3(0, 0, 0),
        ),
        orientation: new Quaternion(),
        links: {},
    };
    const foundationModel = substituteStitch(placedFoundationStitch);
    const foundationStitch: StitchIR = {
        ...placedFoundationStitch,
        model: {
            curveType: foundationModel.curveType,
            points: arrayToVector3List(foundationModel.points),
        },
    };

    return {
        foundation,
        stitches: [
            foundationStitch,
            ...stitches
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
        ],
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
        case StitchType.SlipKnot:
            return StitchModel.SLIP_KNOT;
        case StitchType.MagicRing:
            return StitchModel.MAGIC_CIRCLE;
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

function foundationToStitch(foundation: Foundation): StitchType {
    switch (foundation) {
        case Foundation.SlipKnot:
            return StitchType.SlipKnot;
        case Foundation.MagicRing:
            return StitchType.MagicRing;
    }
}

function foundationOffset(foundation: Foundation, firstStitchPos: Vector3): Vector3 {
    switch (foundation) {
        case Foundation.SlipKnot:
            return firstStitchPos.clone().add(new Vector3(-0.3, -0.2, 0));
        case Foundation.MagicRing:
            return new Vector3(0, -0.3, 0);
    }
}

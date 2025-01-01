/**
 * The copy-paste elaborator is an extremely simple initial step for the elaborator
 * which simply copies the points that make up a stitch into the position and orientation
 * provided by the placer.
 *
 * No additional work is done to make the resulting stitches look "nice".
 */

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
            // Return a line, just for testing
            return {
                curveType: 'bezier',
                points: [
                    [0.0, 0.0, 0.0],
                    [0.3, 0.0, 0.0],
                    [0.7, 0.0, 0.0],
                    [1.0, 0.0, 0.0],
                ],
            };
        default:
            throw 'Unsupported stitch!';
    }
}

function rotatePoints(stitch: StitchIR): StitchIR {
    // I really don't want to deal with severe rotation jank so
    // I'll keep the quaternion as part of the interface...
    // and just copy paste the Wikipedia conversion to a matrix.
    // If anyone is willing to make quaternions work nicely, please do.
    // Otherwise, I might just switch to Euler angles.
    const { a: r, b: i, c: j, d: k } = stitch.orientation;
    const mat = [
        [1 - 2 * (j * j + k * k), 2 * (i * j - k * r), 2 * (i * k + j * r)],
        [2 * (i * j + k * r), 1 - 2 * (i * i + k * k), 2 * (j * k - i * r)],
        [2 * (i * k - j * r), 2 * (j * k + i * r), 1 - 2 * (i * i + j * j)],
    ];

    return {
        ...stitch,
        model: stitch.model
            ? {
                  ...stitch.model,
                  points: stitch.model.points.map((p) => {
                      const { x, y, z } = p;
                      // handrolled matmul
                      // Also, multiply by 2 to scale the stitches to what the placer thinks is right
                      const rx = 2 * (x * mat[0][0] + y * mat[0][1] + z * mat[0][2]);
                      const ry = 2 * (x * mat[1][0] + y * mat[1][1] + z * mat[1][2]);
                      const rz = 2 * (x * mat[2][0] + y * mat[2][1] + z * mat[2][2]);

                      return {
                          x: rx,
                          y: ry,
                          z: rz,
                      };
                  }),
              }
            : undefined,
    };
}

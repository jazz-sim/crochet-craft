/**
 * The copy-paste elaborator is an extremely simple initial step for the elaborator
 * which simply copies the points that make up a stitch into the position and orientation
 * provided by the placer.
 *
 * No additional work is done to make the resulting stitches look "nice".
 */

import StitchModel from '../../models';
import { Pattern, PlacedStitch, StitchType } from '../../types';
import { makeMultiBezier } from './bezier';
import { arrayToVector3List } from './vectorHelper';
import {
    Mesh,
    BufferGeometry,
    NormalBufferAttributes,
    Material,
    Object3DEventMap,
    TubeGeometry,
    MeshLambertMaterial,
} from 'three';

/**
 * Replaces placed stitches with a set of geometries corresponding to
 * how each stitch would actually look.
 *
 * This only "copy-pastes" from a template, so there is no
 * awareness of distortion, compression, etc.
 * @param placedStitches
 * @returns
 */
export function copyPasteStitches(
    placedStitches: Pattern<PlacedStitch>,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[] {
    return (
        placedStitches.stitches
            // "Copy-paste" step; for each placed stitch,
            // add the points from the base model corresponding to its type
            .map((stitch) => {
                return {
                    ...stitch,
                    ...substituteStitch(stitch),
                };
            })
            // Base models (supposedly) are centered around the origin.
            // This moves them to where the placer thinks they should be
            .map(movePointsToPlacement)
            // Make stitches connect to each other, and not extremely jagged
            .map((stitch, index, arr) => {
                if (
                    index == 0 ||
                    !(stitch.curveType == 'bezier' && arr[index - 1].curveType == 'bezier')
                ) {
                    return stitch;
                }
                return startToEndFixer(stitch, arr[index - 1]);
            })
            // Generate geometries
            // (This could be moved to crochetcraft)
            .flatMap(curveToGeometries)
    );
}

type IntermediatePlacement = PlacedStitch & StitchModel;

/**
 * Moves points of an intermediate stitch to the placement position.
 *
 * TODO: also rotate points to the correct orientation.
 *
 * @param stitch
 * @returns
 */
function movePointsToPlacement(stitch: IntermediatePlacement): IntermediatePlacement {
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
        points: stitch.points.map((p) => {
            const [x, y, z] = p;
            // handrolled matmul
            // Also, multiple by 2 to scale the stitches to what the placer thinks is right
            const rx = 2 * (x * mat[0][0] + y * mat[0][1] + z * mat[0][2]);
            const ry = 2 * (x * mat[1][0] + y * mat[1][1] + z * mat[1][2]);
            const rz = 2 * (x * mat[2][0] + y * mat[2][1] + z * mat[2][2]);

            return [rx + stitch.position.x, ry + stitch.position.y, rz + stitch.position.z];
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
function startToEndFixer(
    nextStitch: IntermediatePlacement,
    prevStitch: IntermediatePlacement,
): IntermediatePlacement {
    // Move end to start
    const endOfPrevStitch = prevStitch.points[prevStitch.points.length - 1];
    // Deep copy to prevent reference jank
    nextStitch.points[0] = [endOfPrevStitch[0], endOfPrevStitch[1], endOfPrevStitch[2]];

    // Reorient anchor for continuity
    // On the one hand, this does make the chain stitch look much better.
    // On the other, this is a lot of work to fix an issue with the original base model.
    // (...which is my fault for the record - Allen)
    // But on the other other hand, it's unreasonable for every base model to end in the same direction.

    // Find the direction of the end of the previous stitch
    // i.e. what way it would go if you extended it along a line
    const prevAnchor = prevStitch.points[prevStitch.points.length - 2];
    const prevAnchorDiff = [
        endOfPrevStitch[0] - prevAnchor[0],
        endOfPrevStitch[1] - prevAnchor[1],
        endOfPrevStitch[2] - prevAnchor[2],
    ];
    const r = Math.sqrt(
        prevAnchorDiff[0] * prevAnchorDiff[0] +
            prevAnchorDiff[1] * prevAnchorDiff[1] +
            prevAnchorDiff[2] * prevAnchorDiff[2],
    );
    const direction = [prevAnchorDiff[0] / r, prevAnchorDiff[1] / r, prevAnchorDiff[2] / r];

    // Get the distance of the first anchor from the first point of the next stitch
    const nextAnchorDiff = [
        nextStitch.points[1][0] - nextStitch.points[0][0],
        nextStitch.points[1][1] - nextStitch.points[0][1],
        nextStitch.points[1][2] - nextStitch.points[0][2],
    ];
    const distance = Math.sqrt(
        nextAnchorDiff[0] * nextAnchorDiff[0] +
            nextAnchorDiff[1] * nextAnchorDiff[1] +
            nextAnchorDiff[2] * nextAnchorDiff[2],
    );

    // Modify the first anchor to be aligned in the same direction as the
    // last anchor of the previous stitch.
    nextStitch.points[1] = [
        nextStitch.points[0][0] + direction[0] * distance,
        nextStitch.points[0][1] + direction[1] * distance,
        nextStitch.points[0][2] + direction[2] * distance,
    ];

    return nextStitch;
}

/**
 * Converts a set of points representing curves into
 * geometries that can be rendered by THREE.
 */
function curveToGeometries(
    stitch: IntermediatePlacement,
): Mesh<TubeGeometry, MeshLambertMaterial, Object3DEventMap>[] {
    // TODO: Make efficient
    switch (stitch.curveType) {
        case 'bezier':
            const curveParts = makeMultiBezier(arrayToVector3List(stitch.points));
            return curveParts.map((curve) => {
                const geometry = new TubeGeometry(curve, 50, 0.1, 10);
                const material = new MeshLambertMaterial();
                const mesh = new Mesh(geometry, material);
                return mesh;
            });
        default:
            throw 'unsupported curve type!';
    }
}

/**
 * Helper function to get the stitch model for a given placed stitch.
 *
 * @param stitch
 * @returns
 */
function substituteStitch(stitch: PlacedStitch) {
    switch (stitch.type) {
        case StitchType.Chain:
            return StitchModel.CHAIN;
        default:
            throw 'Unsupported stitch!';
    }
}

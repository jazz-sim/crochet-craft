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

export function copyPasteStitches(
    placedStitches: Pattern<PlacedStitch>,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[] {
    return placedStitches.stitches
        .map((stitch) => {
            return {
                ...stitch,
                ...substituteStitch(stitch),
            };
        })
        .map(movePointsToPlacement)
        .flatMap(curveToGeometries);
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
            const rx = 2 * (x * mat[0][0] + y * mat[0][1] + z * mat[0][2]);
            const ry = 2 * (x * mat[1][0] + y * mat[1][1] + z * mat[1][2]);
            const rz = 2 * (x * mat[2][0] + y * mat[2][1] + z * mat[2][2]);

            return [rx + stitch.position.x, ry + stitch.position.y, rz + stitch.position.z];
        }),
    };
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

function substituteStitch(stitch: PlacedStitch) {
    switch (stitch.type) {
        case StitchType.Chain:
            return StitchModel.CHAIN;
        default:
            throw 'Unsupported stitch!';
    }
}

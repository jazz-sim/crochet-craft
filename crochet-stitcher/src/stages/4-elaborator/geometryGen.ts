import {
    Mesh,
    BufferGeometry,
    NormalBufferAttributes,
    Material,
    Object3DEventMap,
    TubeGeometry,
    MeshLambertMaterial,
    Vector3,
    DoubleSide,
    Color,
} from 'three';
import { makeMultiBezier } from './bezier';
import { PatternIR, StitchIR } from './ir';

export function generateGeometry(
    pattern: PatternIR,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[][] {
    return (
        pattern.stitches
            // Move points to absolute position instead of relative to center position
            .map(movePointsToPlacement)
            // Generate geometries
            // (This could be moved to crochetcraft)
            .map(curveToGeometries)
    );
}

/**
 * Moves points of an intermediate stitch to the placement position.
 *
 * TODO: also rotate points to the correct orientation.
 *
 * @param stitch
 * @returns
 */
function movePointsToPlacement(stitch: StitchIR): StitchIR {
    return {
        ...stitch,
        model: stitch.model
            ? {
                  ...stitch.model,
                  points: stitch.model.points.map(
                      (p) =>
                          new Vector3(
                              p.x + stitch.position.x,
                              p.y + stitch.position.y,
                              p.z + stitch.position.z,
                          ),
                  ),
              }
            : undefined,
    };
}

/**
 * Converts a set of points representing curves into
 * geometries that can be rendered by THREE.
 */
function curveToGeometries(
    stitch: StitchIR,
): Mesh<TubeGeometry, MeshLambertMaterial, Object3DEventMap>[] {
    if (!stitch.model) {
        return [];
    }
    // TODO: Make efficient
    switch (stitch.model.curveType) {
        case 'bezier':
            const curveParts = makeMultiBezier(stitch.model.points);
            return curveParts.map((curve) => {
                const geometry = new TubeGeometry(curve, 50, 0.1, 10);
                const material = new MeshLambertMaterial();
                material.side = DoubleSide;
                material.color = new Color(stitch.colour);
                material.emissive = material.color;
                const mesh = new Mesh(geometry, material);
                return mesh;
            });
        default:
            throw 'unsupported curve type!';
    }
}

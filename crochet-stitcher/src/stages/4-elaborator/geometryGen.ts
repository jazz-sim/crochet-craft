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
    InstancedMesh,
    BatchedMesh,
    CubicBezierCurve3,
    Matrix4,
} from 'three';
import { makeMultiBezier } from './bezier';
import { PatternIR, StitchIR } from './ir';
import StitchModel from '../../models';
import { arrayToVector3List } from './vectorHelper';
import { StitchType } from '../../types';

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
                material.emissiveIntensity = 0;
                const mesh = new Mesh(geometry, material);
                return mesh;
            });
        default:
            throw 'unsupported curve type!';
    }
}

const STITCH_MATERIAL = new MeshLambertMaterial({
    side: DoubleSide,
    emissiveIntensity: 1,
});

const HOVER_STITCH_MATERIAL = new MeshLambertMaterial({
    side: DoubleSide,
    emissiveIntensity: 10,
});

const CHAIN_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.CHAIN);
const SLIP_KNOT_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.SLIP_KNOT);
const SINGLE_CROCHET_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.SINGLE_CROCHET);
const MAGIC_CIRCLE_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.MAGIC_CIRCLE);
const HALF_DOUBLE_CROCHET_STITCH_GEOMETRY = generateStitchGeometries(
    StitchModel.HALF_DOUBLE_CROCHET,
);
const TREBLE_CROCHET_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.TREBLE_CROCHET);
const DOUBLE_CROCHET_STITCH_GEOMETRY = generateStitchGeometries(StitchModel.DOUBLE_CROCHET);

const TYPE_GEOMETRY_TUPLES: [StitchType, [BufferGeometry, BufferGeometry[]]][] = [
    [StitchType.Chain, CHAIN_STITCH_GEOMETRY],
    [StitchType.SlipKnot, SLIP_KNOT_STITCH_GEOMETRY],
    [StitchType.Single, SINGLE_CROCHET_STITCH_GEOMETRY],
    [StitchType.MagicRing, MAGIC_CIRCLE_STITCH_GEOMETRY],
    [StitchType.Double, DOUBLE_CROCHET_STITCH_GEOMETRY],
    [StitchType.Treble, TREBLE_CROCHET_STITCH_GEOMETRY],
];

/**
 * @returns A list of buffer geometries for a given stitch.
 * For convenience, these are split into the first stitch, and the rest, since the first curve may be modified by the smoother.
 */
function generateStitchGeometries(stitchModel: StitchModel): [BufferGeometry, BufferGeometry[]] {
    const list = makeMultiBezier(
        arrayToVector3List(stitchModel.points).map((v) => v.multiplyScalar(2)),
    ).map((curve) => {
        return new TubeGeometry(curve, 50, 0.1, 10);
    });

    const [first, ...rest] = list;
    return [first, rest];
}

/**
 *
 * @returns A map from stitch types to the list of instanced meshes for the
 * individual curves of that mesh.
 */
function generateInstancedMeshMap(
    totalCounter: Map<StitchType, number>,
): Map<StitchType, InstancedMesh[]> {
    const output = new Map<StitchType, InstancedMesh[]>();

    TYPE_GEOMETRY_TUPLES.forEach(([type, geometries]) => {
        output.set(
            type,
            geometries[1].map(
                (curve) => new InstancedMesh(curve, STITCH_MATERIAL, totalCounter.get(type)!),
            ),
        );
    });

    return output;
}

/**
 * @returns A map from stitch types to counts, initialized to zero.
 */
function generateInstanceCounter(): Map<StitchType, number> {
    const counter = new Map<StitchType, number>();

    TYPE_GEOMETRY_TUPLES.forEach(([type, _]) => {
        counter.set(type, 0);
    });

    return counter;
}

export function genBatchGeometry(pattern: PatternIR): Mesh[] {
    const totalCounter = generateInstanceCounter();
    const counter = generateInstanceCounter();

    const unoptimizedMeshes: Mesh<TubeGeometry, MeshLambertMaterial, Object3DEventMap>[] = [];

    pattern.stitches.forEach((stitch) => {
        totalCounter.set(stitch.type, totalCounter.get(stitch.type)! + 1);
    });
    const instancedMeshMap = generateInstancedMeshMap(totalCounter);
    const instancedMesh2Map = generateInstancedMeshMap(totalCounter);

    const matrix = new Matrix4();

    pattern.stitches.forEach((stitch) => {
        if (!stitch.model) {
            return;
        }

        const index = counter.get(stitch.type)!;
        counter.set(stitch.type, index + 1);

        unoptimizedMeshes.push(
            new Mesh(
                new TubeGeometry(
                    new CubicBezierCurve3(
                        stitch.model.points[0].clone().add(stitch.position),
                        stitch.model.points[1].clone().add(stitch.position),
                        stitch.model.points[2].clone().add(stitch.position),
                        stitch.model.points[3].clone().add(stitch.position),
                    ),
                    50,
                    0.1,
                    10,
                ),
                new MeshLambertMaterial({
                    side: DoubleSide,
                    emissiveIntensity: 1,
                    color: stitch.colour,
                    emissive: stitch.colour,
                }),
            ),
        );

        instancedMeshMap.get(stitch.type)?.forEach((instancedMesh) => {
            matrix.makeRotationFromQuaternion(stitch.orientation);
            matrix.setPosition(stitch.position);
            instancedMesh.setMatrixAt(index, matrix);
            instancedMesh.setColorAt(index, new Color(stitch.colour));
            instancedMesh.instanceMatrix.needsUpdate = true;
        });
    });

    const instances = TYPE_GEOMETRY_TUPLES.flatMap(([type, _]) => {
        const vals = instancedMeshMap.get(type);
        vals?.forEach((val) => val.updateMatrix());
        return vals!;
    });

    return [...unoptimizedMeshes, ...instances];
}

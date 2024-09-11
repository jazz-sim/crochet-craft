import { Vector3 } from 'three';

type VectorListToCodeSettings = {
    precision: number;
};

/**
 * Converts an array of points into JavaScript source code to generate that
 * array of points.
 */
export function vectorListToCode(
    points: Vector3[],
    settings: VectorListToCodeSettings = {
        precision: 4,
    },
) {
    function getComponents(v: Vector3) {
        return `${v.x.toPrecision(settings.precision)}, ${v.y.toPrecision(settings.precision)}, ${v.z.toPrecision(settings.precision)}`;
    }

    return `[
${points.map((vec) => `\tnew Vector3(${getComponents(vec)})`).join(',\n')}
]`;
}

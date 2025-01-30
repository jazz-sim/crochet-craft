import { CubicBezierCurve3, Vector3 } from 'three';

/**
 * Creates an array of CubicBezierCurve3's from the set of given points.
 * Requires an input of `1 + 3k` points to produce k Bezier curves.
 * Points should be provided in the format:
 *
 * `[anchor, pivot, pivot, anchor, pivot, pivot, anchor, ...]`
 *
 * The `i`th Bezier curve uses points in `points[1 + 3(i-1), 1 + 3i]`,
 * so each curve shares its starting and endpoint anchors with the
 * previous or next curve respectively.
 *
 * e.g., Given 10 points, three curves will be produced:
 * - The first curve uses points[0..3]
 * - The second curve uses points [3..6]
 * - The third curve uses points [6..9]
 *
 * For a smooth curve, make sure that for each anchor (other than the first and last),
 * that the pivots before and after that anchor lie on lie on a line passing through that anchor.
 */
export function makeMultiBezier(points: Vector3[]) {
    if (points.length % 3 != 1 || points.length < 4) {
        console.error('Invalid input to makeMultiBezier! (See the comment for input format)');
        console.error(points);
        return [new CubicBezierCurve3()];
    }
    const curves: CubicBezierCurve3[] = [];
    for (let i = 0; i < points.length - 1; i += 3) {
        curves.push(new CubicBezierCurve3(points[i], points[i + 1], points[i + 2], points[i + 3]));
    }
    return curves;
}

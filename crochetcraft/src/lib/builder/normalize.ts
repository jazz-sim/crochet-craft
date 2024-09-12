import { Vector3 } from 'three';

/**
 * Moves `points` so that the first point is located at `target`,
 * which defaults to (0, 0, 0).
 */
export function movePointList(points: Vector3[], target: Vector3 = new Vector3(0, 0, 0)) {
    if (points.length == 0) {
        return points;
    }
    const head = points[0];
    const delta = new Vector3(head.x, head.y, head.z).sub(target);
    return points.map((point) => point.sub(delta));
}

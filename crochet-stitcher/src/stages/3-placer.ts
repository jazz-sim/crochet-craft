import { Vector3 } from 'three';
import { LinkedStitch, Pattern, PlacedStitch } from '../types.js';

export function place(input: Pattern<LinkedStitch>): Pattern<PlacedStitch> {
    throw 0; // TODO
}

/**
 * Returns the force on the x, y, and z axes given a vector expressed in x/y/z and the stitch radii
 * for the two stitches using simple spring force formula using the sum of the stitch radii as the
 * "default" distance of the spring
 *
 * @param v The position of the other stitch relative to the one that force is being applied to
 * @param ownStitchRadius the radius of the stitch to apply force to
 * @param otherStitchRadius the radius of the stitch that is applying force
 * @returns A THREE.Vector3-compatible 3D vector containing the force to apply.
 */
export function evaluateForce(
    v: Vector3,
    ownStitchRadius: number,
    otherStitchRadius: number,
): Vector3 {
    // "spring constant", adjust as needed
    // Allen's note: this spring constant is kind of magical and just worked.
    // I have no idea how Osman magicked this one but it's a pretty good choice.
    const k = 0.5;
    let distance = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    let neutralDistance = ownStitchRadius + otherStitchRadius;
    let diffFromNeutral = distance - neutralDistance;
    let netForce = diffFromNeutral * k;
    let vUnit = { x: v.x / distance, y: v.y / distance, z: v.z / distance };
    let forceXYZ = new Vector3(netForce * vUnit.x, netForce * vUnit.y, netForce * vUnit.z);
    return forceXYZ;
}

/**
 * Applies forces to the points for a single timestep, given their connections to each other.
 * Returns the positions of the points after one timestep in a new array.
 *
 * Allen's note: types are temporary until we get the linker done.
 * The current types are most convenient for the demo; it is unlikely
 * that this will remain the case when the linker is done.
 * (e.g., points, links, and radii should probably be fields of a single object).
 *
 * @param points the list of points to simulate forces on.
 * @param links a list of (one-way) connections. `links[i]` is the list of points that the `i`th is connected to;
 * if `links[i]` contains `k` means point `i` is connected to `k`. It is likely that you want connections to be two-way
 * (so each point attracts/repels the other, this requires `links[k]` contains `i`)
 * @param radii a list of radii - the i`th value is the radius of the `i`th point
 * @param timeStep a multiplier for the forces applied. Values above 1 are not recommended as they are likely to be unstable.
 */
export function evaluateForces(
    points: Vector3[],
    links: number[][],
    radii: number[],
    timeStep: number = 1,
): Vector3[] {
    const output: Vector3[] = new Array(points.length);
    for (let p = 0; p < points.length; ++p) {
        const lastPoint = points[p];
        let netForce = new Vector3(0, 0, 0);

        // For each stitch connected to this one, apply a force on it based on where the other stitches are
        links[p].forEach((link) => {
            const other = points[link];
            let fk = evaluateForce(
                new Vector3(other.x - lastPoint.x, other.y - lastPoint.y, other.z - lastPoint.z),
                radii[p],
                radii[link],
            );
            netForce.add(new Vector3(fk.x, fk.y, fk.z));
        });
        netForce.multiplyScalar(timeStep);
        output[p] = new Vector3(
            lastPoint.x + netForce.x,
            lastPoint.y + netForce.y,
            lastPoint.z + netForce.z,
        );
    }
    return output;
}

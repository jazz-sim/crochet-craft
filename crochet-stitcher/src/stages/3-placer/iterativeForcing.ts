import { Vector3 } from 'three';
import { Pattern, PlacedStitch } from '../../types';

// Lets evaluateForce accept THREE.Vector3. Cannot be cast to THREE.Vector3 due to missing fields.
type Vec3 = {
    x: number;
    y: number;
    z: number;
};

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
export function evaluateForce(v: Vec3, ownStitchRadius: number, otherStitchRadius: number): Vec3 {
    // "spring constant", adjust as needed
    // Allen's note: this spring constant of 0.5 is kind of magical and just worked.
    // I have no idea how Osman magicked this one but it's a pretty good choice.
    const k = 0.5;
    let distance = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    let neutralDistance = ownStitchRadius + otherStitchRadius;
    let diffFromNeutral = distance - neutralDistance;
    let netForce = diffFromNeutral * k;
    let vUnit = { x: v.x / distance, y: v.y / distance, z: v.z / distance };
    let forceXYZ = { x: netForce * vUnit.x, y: netForce * vUnit.y, z: netForce * vUnit.z };
    return forceXYZ;
}

/**
 * WARNING: THIS IS ONLY KEPT FOR COMPATIBILITY WITH AN EXPERIMENT
 * PLEASE use `iterateForces` within the placer instead! (Thanks!)
 *
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

export function iterateForces(
    pattern: Pattern<PlacedStitch>,
    maxIterations: number = 100,
    timeStep: number = 1,
    movementThreshold: number = 1,
): Pattern<PlacedStitch> {
    const { foundation, stitches } = pattern;
    const numStitches = stitches.length;

    // If nothing to do
    if (numStitches < 2) {
        return pattern;
    }

    // Prev/next
    stitches[0].links.next = stitches[1];
    for (let i = 1; i < numStitches - 1; ++i) {
        stitches[i].links.prev = stitches[i - 1];
        stitches[i].links.next = stitches[i + 1];
    }
    stitches[numStitches - 1].links.prev = stitches[numStitches - 2];

    // JANK: rely on naive placer estimator for parent/child

    // Helper function to apply forces for a given link, if it exists
    function applyForceIfLinkExists(
        basePosition: Vector3,
        link: PlacedStitch | undefined,
        accumulatedForce: Vector3,
    ) {
        if (link) {
            const fk = evaluateForce(
                {
                    x: link.position.x - basePosition.x,
                    y: link.position.y - basePosition.y,
                    z: link.position.z - basePosition.z,
                },
                // Hardcoded radii
                0.5,
                0.5,
            );
            accumulatedForce.add(new Vector3(fk.x, fk.y, fk.z));
        }
    }

    const forces: Vector3[] = [];
    stitches.forEach(() => forces.push(new Vector3(0, 0, 0)));

    // Actually apply the forces
    for (let iter = 0; iter < maxIterations; ++iter) {
        let totalMovement = 0;
        // Compute all forces
        for (let i = 0; i < numStitches; ++i) {
            const lastPoint = stitches[i].position;
            const { prev, next, parent, children } = stitches[i].links;
            let netForce = new Vector3(0, 0, 0);
            applyForceIfLinkExists(lastPoint, prev, netForce);
            applyForceIfLinkExists(lastPoint, next, netForce);
            applyForceIfLinkExists(lastPoint, parent, netForce);
            for(let c of (children || [])) {
                applyForceIfLinkExists(lastPoint, c, netForce);
            }
            netForce.multiplyScalar(timeStep);
            forces[i] = netForce;
            totalMovement += netForce.lengthSq();
        }
        // Apply all forces at once
        for (let i = 0; i < numStitches; ++i) {
            stitches[i].position.add(forces[i]);
        }
        // If things have converged closely enough, just stop iterating immediately.
        if (totalMovement < movementThreshold) {
            console.log(`Rough convergence achieved in ${iter} iterations. Exiting early.`);
            break;
        }
    }
    return pattern;
}

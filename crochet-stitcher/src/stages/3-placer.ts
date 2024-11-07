import { LinkedStitch, Pattern, PlacedStitch } from '../types.js';

export function place(input: Pattern<LinkedStitch>): Pattern<PlacedStitch> {
    throw 0; // TODO
}

// Returns the force on the x, y, and z axes given a vector expressed in x/y/z and the magnitude of st for the two stitches
// using simple spring force formula using the sum of the stitch radii as the "default" distance of the spring
function evaluateForce(v, st1, st2) {
    // "spring constant", adjust as needed
    const k = 0.5
    let distance = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    let neutralDistance = (st1 + st2) / 2;
    let diffFromNeutral = distance - neutralDistance;
    let netForce = diffFromNeutral * k;
    let vUnit = [v[0]/distance, v[1]/distance, v[2]/distance];
    let forceXYZ = [netForce * vUnit[0], netForce * vUnit[1], netForce * vUnit[2]];
    return forceXYZ;
}

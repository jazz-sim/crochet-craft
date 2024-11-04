import { LinkedStitch, Pattern, PlacedStitch } from '../types.js';

export function place(input: Pattern<LinkedStitch>): Pattern<PlacedStitch> {
    throw 0; // TODO
}

// Returns the force on the x, y, and z axes given a vector expressed in x/y/z and the magnitude of st for the two stitches
// using simple spring force formula using the sum of the stitch radii as the "default" distance of the spring
function evaluateForce(v, st1, st2) {
    // "spring constant", adjust as needed
    const k = 1
    let distance = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    let neutralDistance = (st1 + st2) / 2;
    let diffFromNeutral = distance - neutralDistance;
    let forceMagnitude = diffFromNeutral * diffFromNeutral * k;
    let netForce = forceMagnitude < 0 ? forceMagnitude * -1 : forceMagnitude;
    let vUnit = [v[0]/distance, v[1]/distance, v[2]/distance];
    let forceXYZ = [netForce * vUnit[0], netForce * vUnit[1], netForce * vUnit[2]];
    return forceXYZ;
}

/*
Notes:
- constant-wise, n = 4k to keep forces balanced when spheres are exactly touching IF radii are equal
- but if the radii of the two stitches are not equal, then the math for making the constants becomes a bit nasty
    - i.e. nr1^2 = kr1^2 + 2kr1r2 + kr2^2
- I wonder if this is going to overshoot significantly when applying forces on stitches
    that are almost but not quite touching
- Idea: If our ideal perfect equilibrium is when they're touching, we could make forces based off of that instead, so if the spheres are
    almost touching, then the induced force is extremely small
        - model it basically like a spring whose default length is the two radii added
        - problem: this makes all stitches treated equally regardless of size
        - idea: when determining how to move the stitches, you take the calculated force and divide it by size
- Store forces as an overall number (can be + or -) and its unit vector, which we can use to convert it into x, y, and z components


*/

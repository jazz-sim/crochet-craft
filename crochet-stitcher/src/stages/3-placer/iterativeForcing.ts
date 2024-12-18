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
    // Allen's note: this spring constant is kind of magical and just worked.
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

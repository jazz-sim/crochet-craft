import { Quaternion, Vector3 } from 'three';
import { LinkedStitch, Pattern, PlacedStitch } from '../../types';

export function gdPlace(
    pattern: Pattern<LinkedStitch>,
    maxIterations = 500,
): Pattern<PlacedStitch> {
    const positions: Vector3[] = [];
    const orientations: Quaternion[] = [];

    const pushPullConstraints: number[] = [];
    const pushConstraints: number[] = [];
    const flatConstraints: number[] = [];

    let iterations = 0;

    for (let i = 0; i < pattern.stitches.length; i++) {
        const stitch = pattern.stitches[i];

        // Estimate the position of this stitch!
        const lastPosition = positions.at(-1);
        const lastOrientation = orientations.at(-1);

        if (!lastPosition || !lastOrientation) {
            // First stitch, put it in a default location.
            positions.push(new Vector3(0, 0, 0));
            orientations.push(new Quaternion(0, 0, 0, 1));
            continue;
        }

        const naivePosition = lastPosition
            .clone()
            .add(new Vector3(1, 0, 0).applyQuaternion(lastOrientation));

        let position: Vector3;
        let orientation: Quaternion;

        if (!stitch.parents?.length) {
            // No parent -- position based on previous stitch's position
            position = naivePosition;
            orientation = lastOrientation.clone().multiply(new Quaternion(0, 0.01745, 0, 0.99985));
        } else {
            // Has parent -- position based on parent and naive position
            const parentPosition = positions[stitch.parents[0]];
            const parentOrientation = orientations[stitch.parents[0]];
            position = parentPosition
                .clone()
                .add(new Vector3(0, 1, 0).applyQuaternion(parentOrientation));
            // Now drag the position toward the new position

            // Update the quaternion so that the orientation is correct
            const distance1 = lastPosition.clone().sub(position).normalize();
            const distance2 = lastPosition.clone().sub(naivePosition).normalize();
            if (distance1.dot(distance2) < 0) {
                orientation = parentOrientation
                    .clone()
                    .multiply(new Quaternion(0, 0.707, 0, 0.707));
            } else {
                orientation = parentOrientation
                    .clone()
                    .multiply(new Quaternion(0, 0.01745, 0, 0.99985));
            }
        }

        positions.push(position);
        orientations.push(orientation);

        // Add constraints!
        if (i > 0) {
            pushPullConstraints.push(i - 1, i, i, i - 1);
        }
        if (i > 1) {
            flatConstraints.push(i - 2, i - 1, i, i, i - 1, i - 2);
            pushConstraints.push(i - 2, i, i, i - 2);
        }
        if (stitch.parents) {
            const minParent = Math.min(...stitch.parents);
            const maxParent = Math.max(...stitch.parents);
            if (minParent > 0) {
                pushConstraints.push(minParent - 1, i, i, minParent - 1);
            }
            pushConstraints.push(maxParent + 1, i, i, maxParent + 1);
            for (const parent of stitch.parents) {
                pushPullConstraints.push(parent, i, i, parent);
                if (pattern.stitches[parent].parents) {
                    for (const grandparent of pattern.stitches[parent].parents) {
                        flatConstraints.push(grandparent, parent, i, i, parent, grandparent);
                        pushConstraints.push(grandparent, i, i, grandparent);
                    }
                }
            }
        }

        // Apply constraints!
        descend(0.005, 0.2);
    }

    return {
        foundation: pattern.foundation,
        stitches: pattern.stitches.map((stitch, i) => ({
            type: stitch.type,
            position: positions[i],
            orientation: orientations[i],
            links: {}, // TODO
        })),
    };

    function descend(minChange: number, alpha = 0.05) {
        if (iterations > maxIterations) return;
        while (true) {
            if (iterations > maxIterations) {
                console.warn(`gradient descent exceeded maximum ${maxIterations} iterations`);
                break;
            }

            const change = descendOnce(alpha);
            if (change < minChange) {
                console.log(`gradient descent converged in ${iterations} iteration(s)`);
                break;
            }
            iterations++;
        }
    }

    /** Descend for one iteration, returning the sum of squared lengths of deltas */
    function descendOnce(alpha = 0.05): number {
        const deltas = [...Array(positions.length)].map(() => new Vector3());
        for (let i = 0; i < pushPullConstraints.length; i += 2) {
            const target = pushPullConstraints[i];
            const neighbor = pushPullConstraints[i + 1];
            const delta = positions[neighbor].clone().sub(positions[target]);
            delta.setLength(delta.length() - 1);
            deltas[target].add(delta);
        }

        for (let i = 0; i < pushConstraints.length; i += 2) {
            const target = pushConstraints[i];
            const neighbor = pushConstraints[i + 1];
            const delta = positions[neighbor].clone().sub(positions[target]);
            const len = delta.length() - 1;
            if (len >= 0) continue;
            delta.setLength(len);
            deltas[target].add(delta);
        }

        for (let i = 0; i < flatConstraints.length; i += 3) {
            const target1 = flatConstraints[i];
            const pivot = flatConstraints[i + 1];
            const target2 = flatConstraints[i + 2];
            const v1 = positions[target1].clone().sub(positions[pivot]);
            const v2 = positions[target2].clone().sub(positions[pivot]);
            const dividend = v1.length() * v2.length();
            const normal = v2.cross(v1).divideScalar(dividend);
            const delta = normal.cross(v1);
            deltas[target1].add(delta.multiplyScalar(0.25));
        }

        let maxChange = 0;
        for (let i = 0; i < deltas.length; i++) {
            positions[i].add(deltas[i].multiplyScalar(alpha));
            maxChange = Math.max(maxChange, deltas[i].lengthSq());
        }

        return Math.sqrt(maxChange);
    }
}

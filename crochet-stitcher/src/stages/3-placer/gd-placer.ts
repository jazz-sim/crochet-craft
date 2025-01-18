import { Quaternion, Vector3 } from 'three';
import { LinkedStitch, Pattern, PlacedStitch, StitchType } from '../../types';

export function gdPlace(pattern: Pattern<LinkedStitch>, maxIterations = 20): Pattern<PlacedStitch> {
    const positions: Vector3[] = [];
    const orientations: Quaternion[] = [];

    for (const stitch of pattern.stitches) {
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

        if (stitch.parent === null) {
            // No parent -- position based on previous stitch's position
            position = naivePosition;
            orientation = lastOrientation.clone().multiply(new Quaternion(0, 0.01745, 0, 0.99985));
        } else {
            // Has parent -- position based on parent and naive position
            const parentPosition = positions[stitch.parent];
            const parentOrientation = orientations[stitch.parent];
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
    }

    descend();

    return {
        foundation: pattern.foundation,
        stitches: pattern.stitches.map((stitch, i) => ({
            type: stitch.type,
            position: positions[i],
            orientation: orientations[i],
            links: {}, // TODO
        })),
    };

    function descend() {
        let previousError = Infinity;
        for (let iterations = 1; ; ++iterations) {
            if (iterations > maxIterations) {
                console.warn(`gradient descent exceeded maximum ${maxIterations} iterations`);
                break;
            }

            let error = 0;

            for (let i = 0; i < positions.length; ++i) {
                const stitch = pattern.stitches[i];

                // Push and pull with its connecting stitches.
                const connections = new Set([...stitch.children, stitch.parent, i + 1, i - 1]);
                for (const connector of connections) {
                    if (connector !== null && positions[connector]) {
                        error += pushPull(positions[i], positions[connector], 0.5, 0.25);
                        for (const nonConnector of [connector - 1, connector + 1]) {
                            if (!connections.has(nonConnector) && positions[nonConnector]) {
                                error += pushPull(positions[i], positions[nonConnector], 0.5, 0);
                            }
                        }
                    }
                }

                // Prevent this stitch from bending too much with its
                // neighbours. Chain stitches are weaker in this regard.
                if (i !== 0 && i !== positions.length - 1) {
                    error += bend(
                        positions[i],
                        positions[i - 1],
                        positions[i + 1],
                        stitch.type === StitchType.Chain ? 0.02 : 0.08,
                    );
                }

                // Prevent this stitch from bending too much with its parent and
                // children.
                if (stitch.parent !== null) {
                    for (const child of stitch.children) {
                        error += bend(
                            positions[i],
                            positions[stitch.parent],
                            positions[child],
                            0.08,
                        );
                    }
                }
            }

            // Check for convergence.
            if (Math.abs(previousError - error) < 1e-6) {
                console.log(`gradient descent converged in ${iterations} iteration(s)`);
                break;
            }
            previousError = error;
        }
    }

    function pushPull(target: Vector3, source: Vector3, push: number, pull: number): number {
        const direction = target.clone().sub(source);
        const distanceSq = direction.lengthSq();
        direction.normalize();
        const ideal = source.clone().add(direction);
        return pushToward(target, ideal, distanceSq > 1 ? pull : push);
    }

    function bend(target: Vector3, source1: Vector3, source2: Vector3, strength: number): number {
        const direction1 = target.clone().sub(source1).normalize();
        const direction2 = target.clone().sub(source2).normalize();
        const ideal1 = target.clone().add(direction2);
        const ideal2 = target.clone().add(direction1);
        const ideal3 = source1.clone().add(source2).multiplyScalar(0.5);

        return (
            pushToward(source1, ideal1, strength) +
            pushToward(source2, ideal2, strength) +
            pushToward(target, ideal3, strength * 2)
        );
    }

    function pushToward(pushee: Vector3, to: Vector3, ratio: number): number {
        const change = to.clone().sub(pushee).multiplyScalar(ratio);
        pushee.add(change);
        return change.lengthSq();
    }
}

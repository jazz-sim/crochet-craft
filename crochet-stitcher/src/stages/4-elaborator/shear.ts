import { Vector3 } from 'three';
import { PatternIR, StitchIR } from './ir';

// (Incomplete)
export function interpolatedShear(pattern: PatternIR) {
    // Get target points from links
    // Assume prev/next are x-axis aligned,
    // Assume parent/children are y-axis aligned

    const shearTargets = new Map<
        StitchIR,
        {
            negX: Vector3;
            posX: Vector3;
            negY: Vector3;
            posY: Vector3;
        }
    >();

    // Set targets to wherever the neighbouring stitches are.
    // If no such stitch exists, assume no shearing (make target axis-aligned)
    pattern.stitches.forEach((stitch) => {
        shearTargets.set(stitch, {
            negX: stitch.links.prev ? stitch.links.prev.position : new Vector3(-1, 0, 0),
            posX: stitch.links.next ? stitch.links.next.position : new Vector3(1, 0, 0),
            negY: stitch.links.parent ? stitch.links.parent.position : new Vector3(0, -1, 0),
            // Only takes in the first child's position into account
            posY: stitch.links.children && stitch.links.children.length > 0 ? stitch.links.children[0].position : new Vector3(0, 1, 0),
        });
    });
}

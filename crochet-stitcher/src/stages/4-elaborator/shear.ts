import { Point } from '../../types';
import { PatternIR, StitchIR } from './ir';

// (Incomplete)
export function interpolatedShear(pattern: PatternIR) {
    // Get target points from links
    // Assume prev/next are x-axis aligned,
    // Assume parent/children are y-axis aligned

    const shearTargets = new Map<
        StitchIR,
        {
            negX: Point;
            posX: Point;
            negY: Point;
            posY: Point;
        }
    >();

    // Set targets to wherever the neighbouring stitches are.
    // If no such stitch exists, assume no shearing (make target axis-aligned)
    pattern.stitches.forEach((stitch) => {
        shearTargets.set(stitch, {
            negX: stitch.links.prev ? stitch.links.prev.position : { x: -1, y: 0, z: 0 },
            posX: stitch.links.next ? stitch.links.next.position : { x: 1, y: 0, z: 0 },
            negY: stitch.links.parent ? stitch.links.parent.position : { x: 0, y: -1, z: 0 },
            posY: stitch.links.children ? stitch.links.children.position : { x: 0, y: 1, z: 0 },
        });
    });
}

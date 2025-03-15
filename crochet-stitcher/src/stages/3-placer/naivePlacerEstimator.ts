/**
 * The naive placer assumes everything exists in well laid rows, and
 * that every row ends in a turn.
 *
 * It relies on other steps in the placer phase (e.g. iterative forcing)
 * to make these naive placements more believable.
 *
 * Assuming this, each row is offset from the next by some amount,
 * and each row begins from the end of the last.
 * The first row goes from left to right (towards positive x),
 * and subsequent rows alternate in direction.
 */

import { Quaternion, Vector3 } from 'three';
import { Foundation, LinkedStitch, Pattern, PlacedStitch, RowEnding } from '../../types';

/**
 * Infers lines from a linked pattern.
 *
 * imo it makes more sense for the linker to give the placer lines,
 * but we can work with the single array.
 */
function convertPatternToLines(pattern: Pattern<LinkedStitch>): LinkedStitch[][] {
    const lines: LinkedStitch[][] = [];
    let currentRow: LinkedStitch[] = [];
    let referenceSet = new Set<number | null>();
    let currentRowRefs = new Set<number | null>();
    const { stitches } = pattern;
    for (let i = 0; i < stitches.length; ++i) {
        // If a stitch would reference something outside of our reference set,
        // we assume that stitch is in a new row.
        if (!(stitches[i].parents == null || (stitches[i].parents || []).length == 0)) {
            let foundParent = false;
            for (let p of (stitches[i].parents || [])) {
                if (referenceSet.has(p)) {
                    foundParent = true;
                    break;   
                }
            }
            if (foundParent) {
                continue;
            }
            lines.push(currentRow);
            currentRow = [];
        }
        currentRowRefs.add(i);
        currentRow.push(stitches[i]);
    }
    // Add last row, if non-empty
    if (currentRow) {
        lines.push(currentRow);
    }
    return lines;
}

const INVERSE_X_DIRECTION = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI);
const IDENITY_QUATERNION = new Quaternion().identity();

export function naivePlacer(pattern: Pattern<LinkedStitch>) {
    const out: (PlacedStitch & {
        parents: number[] | null;
        colour: string;
    })[] = [];
    const lines = pattern.rows !== undefined ? pattern.rows : convertPatternToLines(pattern);
    console.log(lines);
    const endings = pattern.endings;

    // Give up
    if (endings == undefined) {
        return out;
    }

    // Eventually, we can include spacing based on settings.
    // For now, spacing shall be constant.

    // Space between rows
    const rowSpacing = 1;
    // Displacement between the centres of stitches in the same row
    const stitchSpacing = 1;
    // Direction multiplier: 1 if going to the right, and -1 if going to the left
    let direction = 1;

    let placementPoint = new Vector3();
    let prevRadius = -1;

    let firstStitchInRow: Vector3;
    lines.forEach((line, index) => {
        firstStitchInRow = placementPoint;
        switch (endings[index]) {
            case RowEnding.Last:
            case RowEnding.Turn: {
                line.forEach((stitch) => {
                    let stitchLinks : {
                        parents?: PlacedStitch[],
                        children?: PlacedStitch[]
                    }= {};
                    let placedStitch = {
                        ...stitch,
                        links: {},
                        position: placementPoint.clone(),
                        // Trust that this is either +x or -x
                        orientation: direction == 1 ? IDENITY_QUATERNION : INVERSE_X_DIRECTION,
                    };
                    // Add parents and children to their respective link fields
                    if (stitch.parents) {
                        stitchLinks.parents = stitch.parents.map((p_idx) => out[p_idx]);
                        for (let p of stitchLinks.parents) {
                            if (p.links.children) {
                                p.links.children.push(placedStitch);
                            }
                            else {
                                p.links.children = [placedStitch];
                            }
                        }
                    }
                    placedStitch.links = stitchLinks;
                    out.push(placedStitch);
                    // Update position for the next point to place
                    placementPoint.x += stitchSpacing * direction;
                });
                // Update position for start of new row
                placementPoint.x -= stitchSpacing * direction;
                placementPoint.y += rowSpacing;
                // Swap direction when changing rows
                direction *= -1;
                prevRadius = -1;
                break;
            }
            case RowEnding.LoopAround: {
                // Estimate the size of a ring
                const stitchSize = 0.5;
                const ringRadius = (index === lines.length - 1 && lines.length > 1) ? ((lines[lines.length - 2].length * stitchSize) / Math.PI) : 
                    ((line.length * stitchSize) / Math.PI) ;
                let radDiff = Math.abs(ringRadius - prevRadius);
                if (prevRadius > 0) {
                    if (radDiff > 1) {
                        placementPoint.y -= 1
                    }
                    else if (radDiff > 0.001) {
                        placementPoint.y -= Math.sqrt(1 - radDiff * radDiff / 4);
                    }
                }
                
                // Move the ring center "away" from the camera, so the starting stitch lies right above
                // the first stitch of the last row/ring
                const ringCenter = placementPoint.clone()//.add(new Vector3(0, 0, ringRadius));
                line.forEach((stitch, j) => {
                    let stitchLinks : {
                        parents?: PlacedStitch[],
                        children?: PlacedStitch[]
                    }= {};
                    // Place stitch along a ring
                    let effectiveLL = (index === lines.length - 1 && lines.length > 1) ? lines[lines.length - 2].length : line.length;
                    let placedStitch = {
                        ...stitch,
                        links: {},
                        position: ringCenter
                            .clone()
                            .add(
                                new Vector3(
                                    Math.sin((2 * Math.PI * j) / effectiveLL),//line.length),
                                    0,
                                    -Math.cos((2 * Math.PI * j) / effectiveLL),//line.length),
                                ).multiplyScalar(ringRadius),
                            ),
                        // Trust that this is either +x or -x
                        // (This will be overwritten anyways :/)
                        orientation: direction == 1 ? IDENITY_QUATERNION : INVERSE_X_DIRECTION,
                    };
                    // Add parents and children to their respective link fields
                    if (stitch.parents) {
                        stitchLinks.parents = stitch.parents.map((p_idx) => out[p_idx]);
                        for (let p of stitchLinks.parents) {
                            if (p.links.children) {
                                p.links.children.push(placedStitch);
                            }
                            else {
                                p.links.children = [placedStitch];
                            }
                        }
                    }
                    placedStitch.links = stitchLinks;
                    out.push(placedStitch);
                });

                // Update position for start of new row
                placementPoint.x = firstStitchInRow.x;
                placementPoint.y += rowSpacing;
                prevRadius = ringRadius;
                // Direction remains the same
                break;
            }
        }
    });

    return out;
}

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
import { Foundation, LinkedStitch, Pattern, PlacedStitch } from '../../types';
import { evaluateForce } from './iterativeForcing';

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
    switch (pattern.foundation) {
        case Foundation.SlipKnot:
            for (let i = 0; i < stitches.length; ++i) {
                // If a stitch would reference something outside of our reference set,
                // we assume that stitch is in a new row.
                if (!(stitches[i].parent == null || referenceSet.has(stitches[i].parent))) {
                    lines.push(currentRow);
                    currentRow = [];

                    // Make the next set of stitches to reference the current row's stitches
                    referenceSet = currentRowRefs;
                    currentRowRefs = new Set<number | null>();
                }
                currentRowRefs.add(i);
                currentRow.push(stitches[i]);
            }
            // Add last row, if non-empty
            if (currentRow) {
                lines.push(currentRow);
            }
            break;
        case Foundation.MagicRing:
            throw 'Magic Ring not yet supported by naive placer.';
    }
    return lines;
}

export function naivePlacer(pattern: Pattern<LinkedStitch>) {
    const out: (PlacedStitch & {
        parent: number | null;
        colour: string;
    })[] = [];
    const lines = convertPatternToLines(pattern);
    // Eventually, we can include spacing based on settings.
    // For now, spacing shall be constant.

    // Space between rows
    const rowSpacing = 1;
    // Displacement between the centres of stitches in the same row
    const stitchSpacing = 1;
    // Direction multiplier: 1 if going to the right, and -1 if going to the left
    let direction = 1;

    let index = 0;
    let maxIndex = pattern.stitches.length - 1;
    let placementPoint = new Vector3();
    lines.forEach((line) => {
        line.forEach((stitch) => {
            out.push({
                ...stitch,
                links: {},
                position: placementPoint.clone(),
                orientation: new Quaternion(0, 0, direction * -0.7071, 0.7071),
            });
            // Update position for the next point to place
            placementPoint.x += stitchSpacing * direction;
        });
        // Update position for start of new row
        placementPoint.x -= stitchSpacing * direction;
        placementPoint.y += rowSpacing;
        // Swap direction when changing rows
        direction *= -1;
    });

    // Retain parents in links field
    // Should probably be done somewhere else but idk.
    out.forEach((stitch) => {
        if (stitch.parent) {
            stitch.links = {
                parent: out[stitch.parent],
            };
        }
    });
    // Inverse mapping for children
    out.forEach((stitch) => {
        if (stitch.links.parent) {
            stitch.links.parent.links.children = stitch;
        }
    });

    return out;
}

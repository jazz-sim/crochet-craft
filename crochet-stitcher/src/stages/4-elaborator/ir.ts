import { Vector3, Quaternion } from 'three';

import { Foundation, Pattern, PlacedStitch, StitchType } from '../../types';

export interface PatternIR {
    foundation: Foundation;
    stitches: StitchIR[];
}

export interface StitchIR {
    // Pretty much the placed stitch data
    type: StitchType;
    position: Vector3;
    orientation: Quaternion;
    links: {
        prev?: StitchIR;
        next?: StitchIR;
        parent?: StitchIR;
        children?: StitchIR[];
    };
    model?: {
        curveType: 'bezier';
        // Individual points are stored relative to the position Point.
        // This makes transformations about the center of a stitch simpler.
        points: Vector3[];
    };
}

export function placerOutputToIR(pattern: Pattern<PlacedStitch>): PatternIR {
    return pattern;
}

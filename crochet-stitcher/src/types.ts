/** A point in 3D space. */
export interface Point {
    x: number;
    y: number;
    z: number;
}

/** A unit quaternion representing an orientation in 3D space. */
export interface Quaternion {
    a: number;
    b: number;
    c: number;
    d: number;
}

export enum Foundation {
    SlipKnot = 'SlipKnot',
    MagicRing = 'MagicRing',
}

export enum StitchType {
    Chain = 'Chain',
    Slip = 'Slip',
    Single = 'Single',
    Double = 'Double',
    Treble = 'Treble',
    InvisibleDecrease = 'InvisibleDecrease',
}

/**
 * The location of a stitch in the pattern text.
 *
 * WARNING: The fields in this class are provided on a best-effort basis. Hence,
 * this information should ONLY be used for error diagnostics. Do NOT rely on
 * these values in your algorithms!
 */
export class Location {
    constructor(
        /** Line number, starting at 1. */
        public line: number,
        /** Column number, starting at 0. */
        public column: number,
        /** Length of text fragment. */
        public length: number,
        /** Row number. */
        public row = -1,
        /** Stitch number within the row, starting at 1. */
        public stitch = -1,
    ) {}

    toString() {
        let description = '';
        if (this.row >= 0) description += `row ${this.row} `;
        if (this.stitch >= 0) description += `stitch ${this.stitch} `;
        return description + `(input:${this.line}:${this.column})`;
    }
}

export interface Pattern<S> {
    foundation: Foundation;
    stitches: S[];
}

export interface ParsedStitch {
    type: StitchType;
    /**
     * The colour of the stitch. It can be a hex colour (e.g., `#123abc`) or a
     * named colour (e.g., `red`).
     */
    colour: string;
    into: StitchType | null;
    parentOffset: number;
    location: Location;
}

/// An instruction output from the parser can be a stitch, a turn, or an
/// end-of-row marker.
export type ParsedInstruction = ParsedStitch | 'turn' | 'eor';

export interface LinkedStitch {
    type: StitchType;
    /**
     * Index of the stitch that this stitch is hooked to. Null for chain
     * stitches. Null for stitches that hook onto the magic ring foundation.
     */
    parent: number | null;
    colour: string;
    location: Location;
}

export interface PlacedStitch {
    type: StitchType;
    position: Point;
    orientation: Quaternion;
    links: {
        prev?: PlacedStitch;
        next?: PlacedStitch;
        parent?: PlacedStitch;
        // Should be an array...
        children?: PlacedStitch;
    };
}

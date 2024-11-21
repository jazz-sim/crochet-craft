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

export interface Pattern<S> {
    foundation: Foundation;
    stitches: S[];
}

export interface ParsedStitch {
    type: StitchType;
    colour: string;
    into: StitchType | null;
    parentOffset: number;
}

export interface LinkedStitch {
    type: StitchType;
    /**
     * Index of the stitch that this stitch is hooked to. Null for chain
     * stitches. Null for stitches that hook onto the magic ring foundation.
     */
    parent: number | null;
    colour: string;
}

export interface PlacedStitch {
    type: StitchType;
    position: Point;
    orientation: Quaternion;
}

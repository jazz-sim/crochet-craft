import { link } from '../src/stages/2-linker';
import { Foundation, ParsedInstruction, ParsedStitch, StitchType } from '../src/types';
import { st } from './parser.js';
import { mc as rawMc, slkt as rawSlkt } from './util.js';

const mc = rawMc<ParsedInstruction>;
const slkt = rawSlkt<ParsedInstruction>;

const chainLink = {
    parent: null,
    type: StitchType.Chain,
};

function singleLink(parent: number) {
    return {
        parent: parent,
        type: StitchType.Single,
    };
}

function withDefOpt(stitch: any) {
    return {
        colour: 'white',
        ...stitch,
    };
}

function stitchesWithDefOpt(stitches: any[]) {
    return stitches.map(withDefOpt);
}

describe('basic linking', () => {
    test('minimal stitch', () => {
        expect(link(slkt(st(StitchType.Chain, 1)))).toEqual({
            foundation: Foundation.SlipKnot,
            stitches: [withDefOpt(chainLink)],
        });
    });

    test('basic chain', () => {
        expect(link(slkt(st(StitchType.Chain, 3)))).toEqual({
            foundation: Foundation.SlipKnot,
            stitches: stitchesWithDefOpt([chainLink, chainLink, chainLink]),
        });
    });

    test('magic ring', () => {
        expect(link(mc(st(StitchType.Chain, 3), 'eor'))).toEqual({
            foundation: Foundation.MagicRing,
            stitches: stitchesWithDefOpt([chainLink, chainLink, chainLink]),
        });
    });
});

describe('multiple row linking', () => {
    test('two rows', () => {
        expect(link(slkt(st(StitchType.Chain, 3), st(StitchType.Single, 3)))).toEqual({
            foundation: Foundation.SlipKnot,
            stitches: stitchesWithDefOpt([
                chainLink,
                chainLink,
                chainLink,
                singleLink(2),
                singleLink(3),
                singleLink(4),
            ]),
        });
    });

    test('3x3 square', () => {
        expect(
            link(slkt(st(StitchType.Chain, 3), st(StitchType.Single, 3), st(StitchType.Single, 3))),
        ).toEqual({
            foundation: Foundation.SlipKnot,
            stitches: stitchesWithDefOpt([
                chainLink,
                chainLink,
                chainLink,
                singleLink(2),
                singleLink(3),
                singleLink(4),
                singleLink(5),
                singleLink(6),
                singleLink(7),
            ]),
        });
    });
});

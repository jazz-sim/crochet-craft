import { link } from '../src/stages/2-linker';
import { LinkedStitch, ParsedInstruction, StitchType } from '../src/types';
import { lst } from './linker-util.js';
import { st } from './parser.js';
import { mc as rawMc, slkt as rawSlkt } from './util.js';

const mc = rawMc<ParsedInstruction>;
const slkt = rawSlkt<ParsedInstruction>;
const linkedMc = rawMc<LinkedStitch>;
const linkedSlkt = rawSlkt<LinkedStitch>;

describe('basic linking', () => {
    test('minimal stitch', () => {
        expect(link(slkt(st(StitchType.Chain, 1)))).toEqual(linkedSlkt(lst(StitchType.Chain)));
    });

    test('basic chain', () => {
        expect(link(slkt(st(StitchType.Chain, 3)))).toEqual(
            linkedSlkt(lst(StitchType.Chain), lst(StitchType.Chain), lst(StitchType.Chain)),
        );
    });

    test('magic ring', () => {
        expect(link(mc(st(StitchType.Chain, 3), 'eor'))).toEqual(
            linkedMc(lst(StitchType.Chain), lst(StitchType.Chain), lst(StitchType.Chain)),
        );
    });
});

describe('multiple row linking', () => {
    test('two rows', () => {
        expect(link(slkt(st(StitchType.Chain, 3), 'eor', st(StitchType.Single, 3)))).toEqual(
            linkedSlkt(
                lst(StitchType.Chain),
                lst(StitchType.Chain),
                lst(StitchType.Chain),
                lst(StitchType.Single, 0),
                lst(StitchType.Single, 1),
                lst(StitchType.Single, 2),
            ),
        );
    });

    test('3x3 square', () => {
        expect(
            link(
                slkt(
                    st(StitchType.Chain, 3),
                    'turn',
                    st(StitchType.Chain, 1),
                    st(StitchType.Single, 3),
                    'turn',
                    st(StitchType.Single, 3),
                ),
            ),
        ).toEqual(
            linkedSlkt(
                lst(StitchType.Chain),
                lst(StitchType.Chain),
                lst(StitchType.Chain),
                lst(StitchType.Chain),
                lst(StitchType.Single, 2),
                lst(StitchType.Single, 1),
                lst(StitchType.Single, 0),
                lst(StitchType.Single, 6),
                lst(StitchType.Single, 5),
                lst(StitchType.Single, 4),
            ),
        );
        /* Visually, we should get something like:
         7  8  9
		 6  5  4 (3)
		 0  1  2
		*/
    });
});

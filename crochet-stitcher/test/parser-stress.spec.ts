import { parse } from '../src/stages/1-parser.js';
import { StitchType } from '../src/types';
import { st } from './parser.spec.js';
import { mc } from './util.js';

test('heart', () => {
    expect(
        parse(`# Credit: Hooked by Robin
MR, ch 2, 3 tr
3 dc, ch 1
Tr, ch 1
3 dc
3 tr, ch 2
Sl st, ch 1`),
    ).toEqual(
        mc(
            st(StitchType.Chain, 2),
            st(StitchType.Treble, 3),
            st(StitchType.Double, 3),
            st(StitchType.Chain, 1),
            st(StitchType.Treble, 1),
            st(StitchType.Chain, 1),
            st(StitchType.Double, 3),
            st(StitchType.Treble, 3),
            st(StitchType.Chain, 2),
            st(StitchType.Slip),
            st(StitchType.Chain, 1),
        ),
    );
});

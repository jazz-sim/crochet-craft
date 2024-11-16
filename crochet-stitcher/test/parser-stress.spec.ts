import { parse } from '../src/stages/1-parser.js';
import { StitchType } from '../src/types';
import { st } from './parser.js';
import { mc, slkt } from './util.js';

test('heart', () => {
    expect(
        parse(`
# Credit: Hooked by Robin - https://www.hookedbyrobin.com/blog/crochet-tiny-heart
MR
Ch 2, 3 TR
3 DC, Ch 1
1 TR, Ch 1
3 DC
3 TR, Ch 2
Sl st, Ch 1`),
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

test('sticker without into clauses', () => {
    const text = '[{ch 5, sc} twice, ch 5, dc, {ch 1, dc} 6 times] twice';
    const squareBracketContents = [
        st(StitchType.Chain, 5),
        st(StitchType.Single),
        st(StitchType.Chain, 5),
        st(StitchType.Single),
        st(StitchType.Chain, 5),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
        st(StitchType.Chain, 1),
        st(StitchType.Double),
    ];
    expect(parse(text)).toEqual(slkt(...squareBracketContents, ...squareBracketContents));
});

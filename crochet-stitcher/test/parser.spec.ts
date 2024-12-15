import { parse } from '../src/stages/1-parser.js';
import { ParsedInstruction, StitchType } from '../src/types.js';
import { st } from './parser.js';
import { mc as rawMc, slkt as rawSlkt } from './util.js';

const mc = rawMc<ParsedInstruction>;
const slkt = rawSlkt<ParsedInstruction>;

describe('simple tests', () => {
    test('single stitch', () => {
        expect(parse('sc')).toEqual(slkt(st(StitchType.Single, 1)));
    });

    test('stitch with count after', () => {
        expect(parse('sc 42')).toEqual(slkt(st(StitchType.Single, 42)));
    });

    test('stitch with count before', () => {
        expect(parse('42 sc')).toEqual(slkt(st(StitchType.Single, 42)));
    });

    test('stitch with count and extra keywords', () => {
        expect(parse('sc st 42x times')).toEqual(slkt(st(StitchType.Single, 42)));
    });

    test('stitch with count and "more" keyword', () => {
        expect(parse('sc 42 more times')).toEqual(slkt(st(StitchType.Single, 43)));
    });

    test('multiple stitches', () => {
        expect(parse('sc, dc')).toEqual(slkt(st(StitchType.Single), st(StitchType.Double)));
    });

    test('multiple stitches with counts', () => {
        expect(parse('sc 2, dc 33')).toEqual(
            slkt(st(StitchType.Single, 2), st(StitchType.Double, 33)),
        );
    });

    test('magic circle foundation', () => {
        expect(parse('mc, 3sc')).toEqual(mc(st(StitchType.Single, 3), 'eor'));
    });

    test('initial row number', () => {
        expect(parse('1. 2 tr')).toEqual(slkt(st(StitchType.Treble, 2)));
    });

    test('initial row number range', () => {
        expect(parse('3-7. 2 tr')).toEqual(slkt(st(StitchType.Treble, 10)));
    });

    test('colour', () => {
        expect(parse('ch 2, Red: ch 2')).toEqual(
            slkt(st(StitchType.Chain, 2), st(StitchType.Chain, 2, 0, 'red')),
        );
    });

    test('hex colour', () => {
        expect(parse('#Ff0000 : ch 2, #0000ff: ch 2')).toEqual(
            slkt(st(StitchType.Chain, 2, 0, '#ff0000'), st(StitchType.Chain, 2, 0, '#0000ff')),
        );
    });

    test('turns', () => {
        expect(parse('ch 2, turn, ch 2')).toEqual(
            slkt(st(StitchType.Chain, 2), 'turn', st(StitchType.Chain, 2)),
        );
    });
});

describe('increases and decreases', () => {
    test('sc increase', () => {
        expect(parse('sc inc')).toEqual(
            slkt(st(StitchType.Single, 1, 0), st(StitchType.Single, 1, -1)),
        );
    });

    test('increase with implicit sc', () => {
        expect(parse('inc')).toEqual(
            slkt(st(StitchType.Single, 1, 0), st(StitchType.Single, 1, -1)),
        );
    });

    test('increase with non-sc stitch', () => {
        expect(parse('dc inc')).toEqual(
            slkt(st(StitchType.Double, 1, 0), st(StitchType.Double, 1, -1)),
        );
    });

    test('repeated increase', () => {
        expect(parse('inc 3')).toEqual(
            slkt(
                st(StitchType.Single, 1, 0),
                st(StitchType.Single, 1, -1),
                st(StitchType.Single, 1, 0),
                st(StitchType.Single, 1, -1),
                st(StitchType.Single, 1, 0),
                st(StitchType.Single, 1, -1),
            ),
        );
    });

    test('decrease', () => {
        expect(parse('dec')).toEqual(slkt(st(StitchType.InvisibleDecrease)));
    });

    test('decrease with invisible keyword', () => {
        expect(parse('inv dec')).toEqual(slkt(st(StitchType.InvisibleDecrease)));
    });

    test('repeated decrease', () => {
        expect(parse('3 dec')).toEqual(slkt(st(StitchType.InvisibleDecrease, 3)));
    });
});

describe('repeats', () => {
    test('bracketed repeat', () => {
        expect(parse('2 (sc5, ch5)')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('bracketed repeat with "more" keyword', () => {
        expect(parse('(sc5, ch5) 2 more times')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('bracketed repeat with "twice" keyword', () => {
        expect(parse('(sc5, ch5) twice')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('bracketed repeat with "twice more" keywords', () => {
        expect(parse('(sc5, ch5) twice more')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('starred repeat with implied "more" keyword', () => {
        expect(parse('*sc5, ch5, rep * 2 times')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('starred repeat with explicit "more" keyword', () => {
        expect(parse('*sc5, ch5, rep * 2 more times')).toEqual(
            slkt(
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
                st(StitchType.Single, 5),
                st(StitchType.Chain, 5),
            ),
        );
    });

    test('nested bracket repeats', () => {
        expect(parse('2 (sc 1, 2 (ch, dc))')).toEqual(
            slkt(
                st(StitchType.Single),
                st(StitchType.Chain),
                st(StitchType.Double),
                st(StitchType.Chain),
                st(StitchType.Double),
                st(StitchType.Single),
                st(StitchType.Chain),
                st(StitchType.Double),
                st(StitchType.Chain),
                st(StitchType.Double),
            ),
        );
    });
});

describe('multi-line', () => {
    test('basic multi-line pattern', () => {
        expect(parse('ch 5\nsc 4')).toEqual(
            slkt(st(StitchType.Chain, 5), st(StitchType.Single, 4)),
        );
    });

    test('multi-line pattern with row numbers', () => {
        expect(parse('1. ch 5\n2. sc 4')).toEqual(
            slkt(st(StitchType.Chain, 5), st(StitchType.Single, 4)),
        );
    });

    test('empty lines', () => {
        expect(parse('1. ch 5\n\n    \t  \n\n2. sc 4')).toEqual(
            slkt(st(StitchType.Chain, 5), st(StitchType.Single, 4)),
        );
    });

    test('comments', () => {
        expect(parse('1. ch 5\n\n    // this is a comment\n\n2. sc 4')).toEqual(
            slkt(st(StitchType.Chain, 5), st(StitchType.Single, 4)),
        );
    });
});

describe('complex tests', () => {
    test('basic string parse', () => {
        expect(parse('Chain 1, Slip 2, Single 3, Double 4, Treble 5')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Slip, 2),
                st(StitchType.Single, 3),
                st(StitchType.Double, 4),
                st(StitchType.Treble, 5),
            ),
        );
    });

    test('Basic test 1', () => {
        expect(parse('ch 5, ch 10, 10 ch, sc 20, 20 sc')).toEqual(
            slkt(
                st(StitchType.Chain, 5),
                st(StitchType.Chain, 10),
                st(StitchType.Chain, 10),
                st(StitchType.Single, 20),
                st(StitchType.Single, 20),
            ),
        );
    });

    test('repeat test 1', () => {
        expect(parse('ch 1, * sc 10, ch 1, rep 3 from *')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
            ),
        );
    });

    test('repeat test 2', () => {
        expect(parse('ch 1, * sc 10, ch 1, rep 3 more times from *')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
            ),
        );
    });

    test('repeat test 3', () => {
        expect(parse('ch 1, 3x (sc 10, ch 1)')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
            ),
        );
    });

    test('repeat test 4', () => {
        expect(parse('ch 1, (sc 10, ch 1) x3')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
            ),
        );
    });

    test('repeat test 5', () => {
        expect(parse('ch 1, 3 (sc 10, ch 1)')).toEqual(
            slkt(
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
                st(StitchType.Single, 10),
                st(StitchType.Chain, 1),
            ),
        );
    });

    test.skip('test linker meta things', () => {
        const text =
            '[{ch 5 sc in next ch sp} twice, ' +
            'ch 5, sk next dc, dc in next dc, ' +
            '{ch 1, sk next dc, dc in next dc} 6 times] twice';
        expect(parse(text)).toEqual(slkt(/* ??? */));
    });
});

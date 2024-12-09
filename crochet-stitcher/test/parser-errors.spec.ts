import { parse } from '../src/stages/1-parser.js';
import { slkt } from './util.js';
import { st } from './parser.js';
import { StitchType } from '../src/types.js';

describe('stitch limit', () => {
    test('via large number', () => {
        expect(() => parse('ch 20001')).toThrow(/stitch limit/i);
    });

    test('via large repetition', () => {
        expect(() => parse('10001 (ch 1, sc)')).toThrow(/stitch limit/i);
    });

    test('via the last straw', () => {
        expect(() => parse('10000 (ch 1, sc), dc')).toThrow(/stitch limit/i);
    });

    test('via nested repetition', () => {
        expect(() => parse('50 (50 (ch 50))')).toThrow(/stitch limit/i);
    });

    test('barely below limit', () => {
        expect(parse('ch20000')).toEqual(slkt(st(StitchType.Chain, 20000)));
    });
});

describe('syntax errors', () => {
    test('multiple counts', () => {
        expect(() => parse('2 ch 2')).toThrow();
    });

    test('zero count', () => {
        expect(() => parse('ch 0')).toThrow(/zero/i);
    });

    test('zero repeat', () => {
        expect(() => parse('(ch 2, sc 2) 0 times')).toThrow(/zero/i);
    });

    test('zero repeat with "more" keyword', () => {
        expect(() => parse('(ch 2, sc 2) 0 more times')).toThrow(/zero/i);
    });

    test('starred repeat without count', () => {
        expect(() => parse('* ch 3, rep from *')).toThrow(/count/i);
    });

    test('trailing comma', () => {
        expect(() => parse('ch 3,')).toThrow();
    });

    test('trailing symbol', () => {
        expect(() => parse('ch 3?')).toThrow();
    });

    test('trailing colour', () => {
        expect(() => parse('ch 3, Red:')).toThrow();
    });

    test('unclosed bracket', () => {
        expect(() => parse('3 (ch 2, sc')).toThrow();
    });

    test('unclosed starred repeat', () => {
        expect(() => parse('* 3 ch')).toThrow();
    });

    test('missing stitch type', () => {
        expect(() => parse('2')).toThrow();
    });
});

describe('semantic errors', () => {
    test('invalid row number range', () => {
        expect(() => parse('4-3. 2 tr')).toThrow(/row.*range/i);
    });
});

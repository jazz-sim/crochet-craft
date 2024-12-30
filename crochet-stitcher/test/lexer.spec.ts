import { Keyword, lex, Token } from '../src/stages/1-parser/lexer.js';
import { Location } from '../src/types.js';

test('empty string', () => {
    expect(lex('    \t  ')).toEqual([]);
});

test('basic keywords', () => {
    expect(lex('sc 2 rep * hdc')).toEqual<Token[]>([
        { location: new Location(0, 0, 2), type: 'keyword', value: Keyword.Single },
        { location: new Location(0, 3, 1), type: 'number', value: 2 },
        { location: new Location(0, 5, 3), type: 'keyword', value: Keyword.Repeat },
        { location: new Location(0, 9, 1), type: 'symbol', value: '*' },
        { location: new Location(0, 11, 3), type: 'keyword', value: Keyword.HalfDouble },
    ]);
});

test('keywords adjacent to numbers', () => {
    expect(lex('ch100, rep3x')).toEqual<Token[]>([
        { location: new Location(0, 0, 2), type: 'keyword', value: Keyword.Chain },
        { location: new Location(0, 2, 3), type: 'number', value: 100 },
        { location: new Location(0, 5, 1), type: 'symbol', value: ',' },
        { location: new Location(0, 7, 3), type: 'keyword', value: Keyword.Repeat },
        { location: new Location(0, 10, 1), type: 'number', value: 3 },
        { location: new Location(0, 11, 1), type: 'keyword', value: Keyword.Times },
    ]);
});

test('color', () => {
    expect(lex('#AbCdeF')).toEqual<Token[]>([
        { location: new Location(0, 0, 7), type: 'color', value: '#abcdef' },
    ]);
});

test('invalid color', () => {
    expect(lex('#dec dec')).toEqual<Token[]>([
        { location: new Location(0, 0, 1), type: 'symbol', value: '#' },
        { location: new Location(0, 1, 3), type: 'keyword', value: Keyword.Decrease },
        { location: new Location(0, 5, 3), type: 'keyword', value: Keyword.Decrease },
    ]);
});

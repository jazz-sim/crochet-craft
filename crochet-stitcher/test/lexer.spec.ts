import { Keyword, lex, Location, Token } from '../src/stages/1-parser/lexer.js';

test('empty string', () => {
    expect(lex('    \t  ')).toEqual([]);
});

test('basic keywords', () => {
    expect(lex('sc 2 rep * hdc')).toEqual<(Token & Location)[]>([
        { line: 0, column: 0, length: 2, type: 'keyword', value: Keyword.Single },
        { line: 0, column: 3, length: 1, type: 'number', value: 2 },
        { line: 0, column: 5, length: 3, type: 'keyword', value: Keyword.Repeat },
        { line: 0, column: 9, length: 1, type: 'symbol', value: '*' },
        { line: 0, column: 11, length: 3, type: 'keyword', value: Keyword.HalfDouble },
    ]);
});

test('keywords adjacent to numbers', () => {
    expect(lex('ch100, rep3x')).toEqual<(Token & Location)[]>([
        { line: 0, column: 0, length: 2, type: 'keyword', value: Keyword.Chain },
        { line: 0, column: 2, length: 3, type: 'number', value: 100 },
        { line: 0, column: 5, length: 1, type: 'symbol', value: ',' },
        { line: 0, column: 7, length: 3, type: 'keyword', value: Keyword.Repeat },
        { line: 0, column: 10, length: 1, type: 'number', value: 3 },
        { line: 0, column: 11, length: 1, type: 'keyword', value: Keyword.Times },
    ]);
});

test('color', () => {
    expect(lex('#AbCdeF')).toEqual<(Token & Location)[]>([
        { line: 0, column: 0, length: 7, type: 'color', value: '#abcdef' },
    ]);
});

test('invalid color', () => {
    expect(lex('#dec dec')).toEqual<(Token & Location)[]>([
        { line: 0, column: 0, length: 1, type: 'symbol', value: '#' },
        { line: 0, column: 1, length: 3, type: 'keyword', value: Keyword.Decrease },
        { line: 0, column: 5, length: 3, type: 'keyword', value: Keyword.Decrease },
    ]);
});

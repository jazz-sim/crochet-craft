import { Keyword, lex, Token } from '../src/stages/1-parser/lexer.js';

test('empty string', () => {
    expect(lex('    \t  ')).toEqual([]);
});

test('basic keywords', () => {
    expect(lex('sc 2 rep * hdc')).toEqual<Token[]>([
        { type: 'keyword', value: Keyword.Single },
        { type: 'number', value: 2 },
        { type: 'keyword', value: Keyword.Repeat },
        { type: 'symbol', value: '*' },
        { type: 'keyword', value: Keyword.HalfDouble },
    ]);
});

test('keywords adjacent to numbers', () => {
    expect(lex('ch100, rep3x')).toEqual<Token[]>([
        { type: 'keyword', value: Keyword.Chain },
        { type: 'number', value: 100 },
        { type: 'symbol', value: ',' },
        { type: 'keyword', value: Keyword.Repeat },
        { type: 'number', value: 3 },
        { type: 'keyword', value: Keyword.Times },
    ]);
});

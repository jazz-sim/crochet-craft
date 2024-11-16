export enum Keyword {
    // Generic words:
    Stitch = 'Stitch',
    // Foundations:
    MagicRing = 'MagicRing',
    // Stitches:
    Chain = 'Chain',
    Slip = 'Slip',
    Single = 'Single',
    Double = 'Double',
    HalfDouble = 'HalfDouble',
    Treble = 'Treble',
    Increase = 'Increase',
    Decrease = 'Decrease',
    // Into-clauses:
    Into = 'Into',
    Next = 'Next',
    // Repeating:
    Repeat = 'Repeat',
    From = 'From',
    Twice = 'Twice',
    Thrice = 'Thrice',
    Times = 'Times',
    More = 'More',
}

export type Token =
    | { type: 'keyword'; value: Keyword }
    | { type: 'color'; value: string }
    | { type: 'symbol'; value: string }
    | { type: 'number'; value: number };

export interface Location {
    line: number;
    column: number;
    length: number;
}

export function lex(input: string, line = 0): (Token & Location)[] {
    const tokens: (Token & Location)[] = [];

    const regex = /[A-Za-z_]+|\d+|\S/g;
    while (true) {
        const match = regex.exec(input);
        if (!match) break;
        const value = match[0].toLowerCase();
        const loc = { line, column: match.index, length: match[0].length };

        if (KEYWORD_LUT[value]) {
            tokens.push({ ...loc, type: 'keyword', value: KEYWORD_LUT[value] });
        } else if (COLOR_LUT.has(value)) {
            tokens.push({ ...loc, type: 'color', value });
        } else if (/^\d+$/.test(value)) {
            tokens.push({ ...loc, type: 'number', value: parseInt(value) });
        } else if (/^\W$/.test(value)) {
            tokens.push({ ...loc, type: 'symbol', value });
        } else {
            throw Error(`Unrecognized token '${value}'`);
        }
    }

    return tokens;
}

const KEYWORD_NAMES: Record<Keyword, string[]> = {
    [Keyword.Stitch]: ['stitch', 'st'],
    [Keyword.MagicRing]: ['mr', 'mc'],
    [Keyword.Chain]: ['chain', 'ch'],
    [Keyword.Slip]: ['slip', 'sl', 'slst', 'ss'],
    [Keyword.Single]: ['single', 'sc'],
    [Keyword.Double]: ['double', 'dc'],
    [Keyword.HalfDouble]: ['hdc'],
    [Keyword.Treble]: ['treble', 'triple', 'tr', 'tc'],
    [Keyword.Increase]: ['increase', 'inc'],
    [Keyword.Decrease]: ['decrease', 'dec'],
    [Keyword.Into]: ['into', 'in'],
    [Keyword.Next]: ['next'],
    [Keyword.Repeat]: ['repeat', 'rep'],
    [Keyword.From]: ['from'],
    [Keyword.Twice]: ['twice', 'two'],
    [Keyword.Thrice]: ['thrice', 'three'],
    [Keyword.Times]: ['times', 'time', 'x'],
    [Keyword.More]: ['more'],
};

const KEYWORD_LUT: Record<string, Keyword> = Object.fromEntries(
    Object.entries(KEYWORD_NAMES).flatMap(([keyword, names]) =>
        names.map((name) => [name, keyword as Keyword]),
    ),
);

const COLOR_LUT = new Set<string>([
    'white',
    'black',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
]);

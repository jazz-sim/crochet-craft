import { Location } from '../../types';

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
    Invisible = 'Invisible',
    Decrease = 'Decrease',
    // Other commands:
    Turn = 'Turn',
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

type TokenData =
    | { type: 'keyword'; value: Keyword }
    | { type: 'color'; value: string }
    | { type: 'symbol'; value: string }
    | { type: 'number'; value: number };

export type Token = TokenData & { location: Location };

export function lex(input: string, line = 0): Token[] {
    const tokens: Token[] = [];

    // sc2tog would normally be parsed as 3 tokens (sc, 2, tog), but we add a
    // special case in for this
    const regex = /sc2tog\b|[a-z_]+|\d+|#[0-9a-f]{6}|\S/gi;
    while (true) {
        const match = regex.exec(input);
        if (!match) break;
        const value = match[0].toLowerCase();
        const location = new Location(line, match.index, match[0].length);

        if (KEYWORD_LUT[value]) {
            tokens.push({ location, type: 'keyword', value: KEYWORD_LUT[value] });
        } else if (/^#\w+$/.test(value)) {
            tokens.push({ location, type: 'color', value });
        } else if (COLOR_LUT.has(value)) {
            tokens.push({ location, type: 'color', value: value.toLowerCase() });
        } else if (/^\d+$/.test(value)) {
            tokens.push({ location, type: 'number', value: parseInt(value) });
        } else if (/^\W$/.test(value)) {
            tokens.push({ location, type: 'symbol', value });
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
    [Keyword.Invisible]: [],
    [Keyword.Decrease]: ['decrease', 'dec', 'sc2tog'],
    [Keyword.Turn]: ['turn'],
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

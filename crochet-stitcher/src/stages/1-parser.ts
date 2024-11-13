import { Colour, Foundation, ParsedStitch, Pattern, StitchType } from '../types.js';
import { Keyword, lex } from './1-parser/lexer.js';

export function parse(input: string): Pattern<ParsedStitch> {
    const tokens = lex(input);
    console.log(tokens);
    let foundation = Foundation.SlipKnot;
    let colour = Colour.White;

    let stitches: ParsedStitch[] = [];
    let curStitchType = null;
    let curStitchCount = null;
    // parser which ignores repeats
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token.type === 'color') {
            colour = Colour[token.value as keyof typeof Colour];
        } else if (token.type === 'keyword') {
            if (token.value === Keyword.Chain) {
                curStitchType = StitchType.Chain;
            } else if (token.value === Keyword.Single) {
                curStitchType = StitchType.Single;
            } else if (token.value === Keyword.Double) {
                curStitchType = StitchType.Double;
            } else if (token.value === Keyword.Slip) {
                curStitchType = StitchType.Slip;
            } else if (token.value === Keyword.Treble) {
                curStitchType = StitchType.Treble;
            }
        } else if (token.type === 'number') {
            curStitchCount = token.value;
        } else if (token.type === 'symbol') {
            if (token.value === ',') {
                if (curStitchType != null && curStitchCount != null) {
                    stitches.push({
                        type: curStitchType,
                        repeat: curStitchCount,
                        colour: colour,
                        into: null,
                    });
                }
                curStitchCount = null;
                curStitchType = null;
            }
        }
    }

    if (curStitchType !== null && curStitchCount !== null) {
        stitches.push({ type: curStitchType, repeat: curStitchCount, colour: colour, into: null });
    }

    return { foundation, stitches };
}

import { Foundation, ParsedStitch, Pattern, StitchType } from '../types.js';
import { Keyword, lex } from './1-parser/lexer.js';

export function parse(input: string): Pattern<ParsedStitch> {
    const pattern: Pattern<ParsedStitch> = {
        foundation: Foundation.SlipKnot,
        stitches: [],
    };

    let currentColour = 'white';

    const lines = input.split(/\r?\n/);
    for (let lineIndex = 0; lineIndex < lines.length; ++lineIndex) {
        const line = lines[lineIndex];
        const lineNum = lineIndex + 1;
        if (line.trimStart().startsWith('#')) continue;

        const tokens = lex(line, lineNum);
        let i = 0; // index of current token

        // Row number?
        if (tokens[i]?.type === 'number' && tokens[i + 1]?.value === '.') {
            i += 2;
        }

        try {
            // Foundation stitch?
            if (tokens[i]?.value === Keyword.MagicRing) {
                pattern.foundation = Foundation.MagicRing;
                i += 1;
                // Optional comma after MR
                if (tokens[i]) {
                    if (tokens[i].value !== ',') throw 'Expected ,';
                    i += 1;
                }
            }

            // Instructions?
            if (i < tokens.length) {
                pattern.stitches.push(...parseInstructions());
            }
            if (i !== tokens.length) throw 'Syntax error';
        } catch (error) {
            const spaces = tokens[i]?.column ?? line.length;
            const carets = tokens[i]?.length || 1;
            throw Error(
                `Parse error on line ${lineNum}: ${error}\n` +
                    `\t${line}\n` +
                    `\t${' '.repeat(spaces)}${'^'.repeat(carets)}`,
            );
        }

        /** Parses one or more instructions. O(n) */
        function parseInstructions(): ParsedStitch[] {
            const stitches: ParsedStitch[] = [];
            while (true) {
                // Colour?
                if (tokens[i]?.type === 'color') {
                    currentColour = tokens[i]?.value as string;
                    i += 1;
                    // Colon?
                    if (tokens[i]?.value !== ':') {
                        throw 'Expected :';
                    }
                    i += 1;
                    continue;
                }

                // Repeat from?
                if (tokens[i]?.value === Keyword.Repeat) {
                    break; // Let the caller handle this
                }

                // Instruction?
                stitches.push(...parseInstruction());
                // Comma?
                if (tokens[i]?.value !== ',') {
                    break; // No more instructions found
                }
                i += 1;
            }
            return stitches;
        }

        /** Parses an instruction. O(n) */
        function parseInstruction(): ParsedStitch[] {
            // Stitch?
            const stitch = parseStitches();
            if (stitch) return [stitch];
            // Repeat?
            return parseRepeat();
        }

        /** Parses a repeat. O(n). */
        function parseRepeat(): ParsedStitch[] {
            let stitches: ParsedStitch[];
            let count: number | null;

            // Asterisk-style repeat?
            if (tokens[i]?.value === '*') {
                i += 1;
                stitches = parseInstructions();
                // Repeat?
                if (tokens[i]?.value !== Keyword.Repeat) throw 'Expected "repeat" or a stitch';
                i += 1;
                // Count?
                count = parseCount(0);
                // From?
                if (tokens[i]?.value === Keyword.From) i += 1;
                // Star?
                if (tokens[i]?.value !== '*') throw 'Expected *';
                i += 1;
                // Count?
                count ??= parseCount(0);
                if (count === null) throw 'Expected count'; // rep from * with no repeat... error
                count += 1; // 'more' is implied for asterisk-style repeat
            } else {
                // Number before repeat?
                count = parseCount();
                // Left bracket?
                if (!(['(', '[', '{'] as (string | number)[]).includes(tokens[i]?.value)) {
                    throw 'Expected (, [, {, or a stitch type';
                }
                i += 1;
                // Instructions?
                stitches = parseInstructions();
                // Right bracket?
                if (!([')', ']', '}'] as (string | number)[]).includes(tokens[i]?.value)) {
                    throw 'Expected ), ], or }';
                }
                i += 1;
                // Number after repeat?
                count ??= parseCount();
                if (count === null) return stitches; // bracketed with no repeat... just accept it
            }

            // Okay, now just repeat the stitches that many times.
            const repeatedStitches: ParsedStitch[] = [];
            for (let j = 0; j < count; ++j) {
                repeatedStitches.push(...stitches);
            }
            return repeatedStitches;
        }

        /** Tries to parse a stitch with an optional count. O(1). */
        function parseStitches(): ParsedStitch | null {
            const start = i;

            // Number before stitch type?
            let count = parseCount();
            // Stitch type
            const stitch = parseStitch();
            if (!stitch) {
                i = start; // oopsies, couldn't parse a stitch
                // We are backtracking here, but it's okay, since parseCount()
                // and parseStitch() both consume O(1) tokens.
                return null;
            }
            // Number after stitch type?
            count ??= parseCount();

            return {
                type: stitch,
                into: null,
                repeat: count ?? 1,
                colour: currentColour,
            };
        }

        /** Tries to parse a stitch type. O(1). */
        function parseStitch(): StitchType | null {
            const stitchType = {
                [Keyword.Chain]: StitchType.Chain,
                [Keyword.Slip]: StitchType.Slip,
                [Keyword.Single]: StitchType.Single,
                [Keyword.Double]: StitchType.Double,
                [Keyword.Treble]: StitchType.Treble,
            }[tokens[i]?.value];
            if (!stitchType) return null;
            i += 1;
            // Skip the word 'st' after the stitch type (e.g., 'sl st' =>
            // [Keyword.Slip, Keyword.Stitch] and we need to ignore the
            // latter)
            if (tokens[i]?.value === Keyword.Stitch) i += 1;
            return stitchType;
        }

        /** Tries to parse a count. O(1). */
        function parseCount(moreValue = 1): number | null {
            const start = i;
            // 'Times' or 'x'?
            if (tokens[i]?.value === Keyword.Times) i += 1;
            // Count?
            let count: number;
            if (tokens[i]?.type === 'number') {
                count = tokens[i].value as number;
            } else if (tokens[i]?.value === Keyword.Twice) {
                count = 2;
            } else if (tokens[i]?.value === Keyword.Thrice) {
                count = 3;
            } else {
                i = start;
                return null;
            }
            i += 1;
            // Accept "3x times" which is [3, Keyword.Times, Keyword.Times]
            if (tokens[i]?.value === Keyword.Times) i += 1;
            if (tokens[i]?.value === Keyword.Times) i += 1;
            // More?
            if (tokens[i]?.value === Keyword.More) {
                count += moreValue;
                i += 1;
            }
            if (tokens[i]?.value === Keyword.Times) i += 1;
            return count;
        }
    }

    return pattern;
}

import {
    Foundation,
    Location,
    ParsedInstruction,
    ParsedStitch,
    Pattern,
    StitchType,
} from '../types.js';
import { Keyword, lex } from './1-parser/lexer.js';

export function parse(input: string): Pattern<ParsedInstruction> {
    const pattern: Pattern<ParsedInstruction> = {
        foundation: Foundation.SlipKnot,
        stitches: [],
    };

    let currentColour = '#cf80fb';

    const lines = input.split(/\r?\n/);
    let nextRowNumber = 1; // The next row number if it's not specified
    for (let lineIndex = 0; lineIndex < lines.length; ++lineIndex) {
        const line = lines[lineIndex];
        const lineNum = lineIndex + 1;
        if (line.trimStart().startsWith('//')) continue;

        const tokens = lex(line, lineNum);
        let i = 0; // index of current token

        try {
            // Parse row range
            const [rowStart, rowEnd] = parseRowRange() ?? [nextRowNumber, nextRowNumber];
            const rowRepetitions = Math.max(1, rowEnd - rowStart + 1);
            nextRowNumber = rowEnd; // we only add 1 later if there are actually stitches in this row

            // Update the location information of the tokens
            for (const token of tokens) {
                // TODO(jtai): add correct row numbers in the location for each
                // copy of the row in a row range
                token.location.row = rowStart;
            }

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
                const rowInstructions = parseInstructions();

                // Update location information for these stitches
                let stitchNumber = 1;
                for (const instruction of rowInstructions) {
                    if (typeof instruction !== 'string' && instruction.location.stitch < 0) {
                        instruction.location.stitch = stitchNumber++;
                    }
                }

                // Update row number for next row
                if (rowInstructions.length) {
                    nextRowNumber += 1;
                }

                if (pattern.foundation === Foundation.MagicRing) {
                    // Add end-of-row marker only for magic ring patterns
                    rowInstructions.push('eor');
                }

                pattern.stitches.push(...repeat(rowInstructions, rowRepetitions));
                checkStitchLimit(pattern.stitches.length);
            }
            if (i !== tokens.length) throw 'Syntax error';
        } catch (error) {
            const location = tokens[i]?.location ?? new Location(lineNum, line.length, 1);
            const spaces = location.column;
            const carets = location.length || 1;
            throw Error(
                `Parse error at ${location}: ${error}\n` +
                    `\t${line}\n` +
                    `\t${' '.repeat(spaces)}${'^'.repeat(carets)}`,
            );
        }

        /** Parses the row number or range. O(1) */
        function parseRowRange(): [number, number] | null {
            const start = i;

            // Start row number?
            if (tokens[i]?.type !== 'number') return null;
            const startValue = tokens[i].value as number;
            let endValue = startValue;
            i += 1;

            // End row number?
            if (tokens[i]?.value === '-') {
                i += 1;
                if (tokens[i]?.type !== 'number') {
                    i = start;
                    return null;
                }
                endValue = tokens[i].value as number;
                i += 1;
            }
            if (startValue > endValue) throw 'Invalid row number range';

            if (tokens[i]?.value !== '.') {
                i = start;
                return null;
            }
            i += 1;

            return [startValue, endValue];
        }

        /** Parses one or more instructions. O(n) */
        function parseInstructions(): ParsedInstruction[] {
            const stitches: ParsedInstruction[] = [];
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
                checkStitchLimit(stitches.length);
                // Comma?
                if (tokens[i]?.value !== ',') {
                    break; // No more instructions found
                }
                i += 1;
            }
            return stitches;
        }

        /** Parses an instruction. O(n) */
        function parseInstruction(): ParsedInstruction[] {
            // Turn?
            if (tokens[i]?.value === Keyword.Turn) {
                i += 1;
                return ['turn'];
            }
            // Stitch?
            const stitches = parseStitches();
            if (stitches) return stitches;
            // Repeat?
            return parseRepeat();
        }

        /** Parses a repeat. O(n). */
        function parseRepeat(): ParsedInstruction[] {
            let stitches: ParsedInstruction[];
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
            return repeat(stitches, count);
        }

        /** Tries to parse a stitch with an optional count. O(1). */
        function parseStitches(): ParsedStitch[] | null {
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

            return repeat(stitch, count ?? 1);
        }

        /** Tries to parse a stitch type. O(1). */
        function parseStitch(): ParsedStitch[] | null {
            let location: Location | null = null;

            const start = i;
            // Invisible?
            if (tokens[i]?.value === Keyword.Invisible) i += 1;
            // Stitch type?
            let stitchType = {
                [Keyword.Chain]: StitchType.Chain,
                [Keyword.Slip]: StitchType.Slip,
                [Keyword.Single]: StitchType.Single,
                [Keyword.Double]: StitchType.Double,
                [Keyword.Treble]: StitchType.Treble,
            }[tokens[i]?.value];
            if (stitchType) {
                location = tokens[i].location;
                i += 1;
            }
            // Stitch?
            if (tokens[i]?.value === Keyword.Stitch) i += 1;
            // Increase/decrease?
            if (tokens[i]?.value === Keyword.Increase) {
                const stitch = {
                    location: tokens[i].location,
                    type: stitchType ?? StitchType.Single,
                    colour: currentColour,
                    into: null,
                };
                i += 1;
                return [
                    { ...stitch, parentOffset: 0 },
                    { ...stitch, parentOffset: -1 },
                ];
            } else if (tokens[i]?.value === Keyword.Decrease) {
                location = tokens[i].location;
                stitchType = StitchType.Sc2tog;
                i += 1;
            }
            // Stitch?
            if (tokens[i]?.value === Keyword.Stitch) i += 1;

            // stitchType and location should be either both null or both
            // non-null. We check both to make TypeScript happy.
            if (!stitchType || !location) {
                i = start;
                return null;
            }
            return [
                { type: stitchType, colour: currentColour, into: null, parentOffset: 0, location },
            ];
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
                if (count === 0) throw 'Count cannot be zero';
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

/** Returns an array containing the input elements repeated `count` times. */
function repeat<T>(array: T[], count: number): T[] {
    // special case for performance
    if (count === 1) return array;

    // try to catch this early
    checkStitchLimit(array.length * count);

    const result: T[] = [];
    const accumulator = array;
    while (true) {
        if (count & 1) result.push(...accumulator);
        count >>= 1;
        if (!count) break;
        accumulator.push(...accumulator);
    }
    return result;
}

function checkStitchLimit(count: number) {
    if (count > MAX_STITCHES) {
        throw `Stitch limit of ${MAX_STITCHES} exceeded`;
    }
}

const MAX_STITCHES = 20_000;

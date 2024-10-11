import { count } from 'console';
import { Foundation, ParsedStitch, Pattern, StitchType } from '../types.js';

enum TokenType {
    Stitch = 'ch', 
    Comma = ',',
    LParen = '(',
    RParen = ')',
    Number = 0, 
    Colon = ":",
    Asterisk = "*",
    Colour = "white",
    Foundation = "mr",
    IntoClause = "into",
    Repeat = "repeat",
    From = "from",
    x = "x",
    More = "more",
    Times = "times"
}

interface ParsedToken {
    type: TokenType,
    value: string | number
}

function stringTokenLUT(input: string): ParsedToken {
    // expects strings to be stripped of all punctuation and whitespace
    input = input.toLowerCase()
    // Things we understand but do not implement
    const notImplementedLUT = new Set<string>([
        "sp", "hdc"
    ])
    if (notImplementedLUT.has(input)) {
        throw new TypeError(`${input} is currently not supported!`)
    }

    // LUT for every valid stitch type
    // Note that this should also include aliases (eg. ch and chain are both in the LUT)
    // "ch" | ("ss" | "slst" | "sl" "st" | "sc" | "dc" | "hdc")
    const stitchLUT = new Set<string>([
        "ch", "ss", "slst", "sl", "st", "sc", "do", "tr", "dc",
        "chain", "slip", "slipknot",  "single", "double", "triple", "treble",
        "inc", "increment", "dec", "decrement", "invert", "inv",
    ])
    if (stitchLUT.has(input)) {
        return {type:TokenType.Stitch, value: input}
    }

    //add more colours here as desired
    const colourLUT = new Set<string>([
        "white", "black", "red", "orange", "yellow", "green", "blue", "indigo", "violet",
    ])
    if (colourLUT.has(input)) {
        return {type:TokenType.Colour, value: input}
    }

    // Note! if the foundation is specified as a slipknot, 
    // there's no way for us to tell the difference between specifying it
    // as a stitch vs a foundation knot based on the grammar. As such we'll only catch magic ring
    const foundationLUT = new Set<string>([
        "mr", "magicring", "magic", "ring"
    ])
    if (foundationLUT.has(input)) {
        return {type: TokenType.Foundation, value: "mr"}
    }

    // This should simplify latter stages of the grammar
    const countAlias = new Set<string>([
        "twice", "thrice"
    ])
    if (countAlias.has(input)) {
        if (input === "twice") {
            return {type: TokenType.Number, value: 2}
        } 
        if (input === "thrice") {
            return {type: TokenType.Number, value: 3}
        }
    }


    // Misc. aliases
    const repeat = new Set<string>([
        "rep", "repeat"
    ])
    if (repeat.has(input)) {
        return {type: TokenType.Repeat, value: "repeat"}
    }

    const times = new Set<string>([
        "time", "times"
    ])
    if (times.has(input)) {
        return {type: TokenType.Times, value: "times"}
    }

    // Misc. cases
    if (input === "*") {
        return {type:TokenType.Asterisk, value: "*"}
    }
    if (input === "x") {
        return {type:TokenType.x, value: "x"}
    }
    if (input === "from") {
        return {type:TokenType.From, value: "from"}
    }
    if (input === "more") {
        return {type:TokenType.More, value: "more"}
    }

    throw new TypeError(`Unknown string token ${input}!`)
}

function tokenizer(input: string): ParsedToken[] {
    input = input.replace(/\s+/g, ' ').trim()
    let output: ParsedToken[] = [] 
    let tokens = input.split(" ")
    for (let i = 0; i < tokens.length; i++) {
        let val = tokens[i]
        let endTokens: ParsedToken[] = [] 
        while (val.length > 0) {
            // strip off any leading brackets (only type of leading thing according to spec)
            if (val[0] == "(") {
                output.push({type: TokenType.LParen, value: "("})
                val = val.substring(1)
                continue
            }
            if (val[0] == "{") {
                output.push({type: TokenType.LParen, value: "{"})
                val = val.substring(1)
                continue
            }
            //strip off trailing colons, rparens, or commas (only type of trailing according to spec)
            if (val.slice(-1) == ")") {
                endTokens.push({type: TokenType.RParen, value: ")"})
                val = val.substring(0, val.length-1)
                continue
            }
            if (val.slice(-1) == "}") {
                endTokens.push({type: TokenType.RParen, value: "}"})
                val = val.substring(0, val.length-1)
                continue
            }
            if (val.slice(-1) == ":") {
                endTokens.push({type: TokenType.Colon, value: ":"})
                val = val.substring(0, val.length-1)
                continue
            }
            if (val.slice(-1) == ")") {
                endTokens.push({type: TokenType.Comma, value: ","})
                val = val.substring(0, val.length-1)
                continue
            }
            // console.log(`sliced ${tokens[i]} to ${val}`)
            break
        }
        
        // Based on the spec we now only have either a string or number as a token
        // So let's try parsing it as an int
        let numberCandidate = parseInt(val)
        if (Number.isNaN(numberCandidate)) {
            // LUT for valid strings
            endTokens.push(stringTokenLUT(val))
        } else {
            // If it is a negative number throw exn
            if (numberCandidate < 1) {
                throw new RangeError(`Repeat counts or stitch counts must be positive integers! 
                                        Found zero or negative value ${numberCandidate}`
                                    )
            }
            endTokens.push({type: TokenType.Number, value: numberCandidate})
        }

        for (let i = endTokens.length-1; i >= 0; i--) {
            output.push(endTokens[i])
        }
    }
    return output
}


export function parse(input: string): Pattern<ParsedStitch> {
    let tokens = tokenizer(input)

    // console.log("Completed tokenization")
    let foundation = Foundation.SlipKnot
    
    let stitches : ParsedStitch[] = []

    return {foundation, stitches}
}

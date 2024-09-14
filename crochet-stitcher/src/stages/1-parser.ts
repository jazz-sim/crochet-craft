import { Foundation, ParsedStitch, Pattern, StitchType } from '../types.js';

export function parse(input: string): Pattern<ParsedStitch> {
    let tokens = input.split(" ")
    // Get the foundation from somewhere??

    let foundation = Foundation.SlipKnot
    
    //TODO: sanitize input
    let stitches : ParsedStitch[] = []
    for (let i = 0; i < tokens.length; i += 2) {
        let type : StitchType = stringToStitchType(tokens[i])
        let repeat : number = parseInt(tokens[i+1])
        stitches.push({type, repeat})
    }

    return {foundation, stitches}
}

function stringToStitchType(input: string) {
    // TODO: sanitize input 
    return StitchType[input as keyof typeof StitchType]
}

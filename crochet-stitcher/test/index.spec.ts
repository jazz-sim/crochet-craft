import {parse} from '../src/stages/1-parser'
import { ParsedStitch, StitchType } from '../src/types';

test('it works', () => {
    expect(2 + 2).toBe(4);
});

test('basic string parse', () => {
    let testStr = "Chain 1, Slip 2, Single 3, Double 4, Treble 5"
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [{type:StitchType.Chain, repeat:1}, {type:StitchType.Slip, repeat:2}, {type:StitchType.Single, repeat:3}, {type:StitchType.Double, repeat:4}, {type:StitchType.Treble, repeat:5}]
    expect(parsed.stitches).toMatchObject(output)
})

import {parse} from '../src/stages/1-parser'
import { Colour, ParsedStitch, StitchType } from '../src/types';

test('it works', () => {
    expect(2 + 2).toBe(4);
});

test('basic string parse', () => {
    let testStr = "Chain 1, Slip 2, Single 3, Double 4, Treble 5"
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Slip, repeat:2, colour: Colour.White}, 
        {type:StitchType.Single, repeat:3, colour: Colour.White}, 
        {type:StitchType.Double, repeat:4, colour: Colour.White}, 
        {type:StitchType.Treble, repeat:5, colour: Colour.White}]
    expect(parsed.stitches).toMatchObject(output)
})

test("Basic test 1", () => {
    let testStr = "ch 5, ch 10, 10 ch, sc 20, 20 sc"
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:5, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:10, colour:  Colour.White}, 
        {type:StitchType.Single, repeat:20, colour: Colour.White}, 
        {type:StitchType.Single, repeat:20, colour: Colour.White}]
    expect(parsed.stitches).toMatchObject(output)
})


test("repeat test 1", () => {
    let testStr = "ch 1, * sc 10, ch 1, rep 3 from *" //4x
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
    ]
    expect(parsed.stitches).toMatchObject(output)
})

test("repeat test 2", () => {
    let testStr = "ch 1, * sc 10, ch 1, rep 3 more times from *" //4x
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
    ]
    expect(parsed.stitches).toMatchObject(output)
})

test("repeat test 3", () => {
    let testStr = "ch 1, 3x (sc 10, ch 1)" //3x
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
    ]
    expect(parsed.stitches).toMatchObject(output)
})

test("repeat test 4", () => {
    let testStr = "ch 1, (sc 10, ch 1) x3" // 3x
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
    ]
    expect(parsed.stitches).toMatchObject(output)
})

test("repeat test 5", () => {
    let testStr = "ch 1, 3 (sc 10, ch 1)" //3x
    let parsed = parse(testStr)
    let output : ParsedStitch[] = [
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
        {type:StitchType.Single, repeat:10, colour: Colour.White}, 
        {type:StitchType.Chain, repeat:1, colour: Colour.White}, 
    ]
    expect(parsed.stitches).toMatchObject(output)
})

test("test linker meta things", () => {
    let testStr = "[{ch 5 sc in next ch sp} twice, ch 5, sk next dc, dc in next dc, {ch 1, sk next dc, dc in next dc} 6 times] twice"
    let parsed = parse(testStr)
    // let output : ParsedStitch[] = [???] 
    //expect(parsed.stitches).toMatchObject(output)
})

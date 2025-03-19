import {
    BufferGeometry,
    InstancedMesh,
    Material,
    Mesh,
    NormalBufferAttributes,
    Object3DEventMap,
} from 'three';
import { Pattern, PlacedStitch } from '../types.js';
import { copyPasteStitches } from './4-elaborator/copyPasteElaborator.js';
import { genBatchGeometry, generateGeometry } from './4-elaborator/geometryGen.js';
import { smoothConnections } from './4-elaborator/smoother.js';
import { PatternIR } from './4-elaborator/ir.js';

const pipelineSteps: ((pre: PatternIR) => PatternIR)[] = [smoothConnections];

export function elaborate(input: Pattern<PlacedStitch>): Mesh[][] {
    // Inital Step: Convert placed patterns into Elaborator IR
    let intermediateRepresentation = copyPasteStitches(input);

    // Pipeline: run each pass in the order defined by `pipelineSteps`
    pipelineSteps.forEach((step) => {
        intermediateRepresentation = step(intermediateRepresentation);
    });

    // Final Step: convert pipeline result into a THREE.js geometry that
    // can be rendered by CrochetCraft directly.
    // const outputGeometry = generateGeometry(intermediateRepresentation);
    const outputGeometry = [genBatchGeometry(intermediateRepresentation)];
    return outputGeometry;
}

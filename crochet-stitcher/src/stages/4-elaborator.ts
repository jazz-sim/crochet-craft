import { Pattern, PlacedStitch } from '../types.js';
import { copyPasteStitches } from './4-elaborator/copyPasteElaborator.js';
import { Mesh, BufferGeometry, NormalBufferAttributes, Material, Object3DEventMap } from 'three';
import { generateGeometry } from './4-elaborator/geometryGen.js';
import { smoothConnections } from './4-elaborator/smoother.js';

export function elaborate(
    input: Pattern<PlacedStitch>,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[] {
    const copyPasteOutput = copyPasteStitches(input);
    const smoothedOutput = smoothConnections(copyPasteOutput);
    const outputGeometry = generateGeometry(smoothedOutput);
    return outputGeometry;
}

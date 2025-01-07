import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';
import { Pattern, PlacedStitch } from '../types.js';
import { copyPasteStitches } from './4-elaborator/copyPasteElaborator.js';

export function elaborate(
    input: Pattern<PlacedStitch>,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[] {
    return copyPasteStitches(input);
}

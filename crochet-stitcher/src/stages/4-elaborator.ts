import { Pattern, PlacedStitch } from '../types.js';
import { copyPasteStitches } from './4-elaborator/copyPasteElaborator.js';
import { Mesh, BufferGeometry, NormalBufferAttributes, Material, Object3DEventMap } from 'three';

export function elaborate(
    input: Pattern<PlacedStitch>,
): Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>[] {
    return copyPasteStitches(input);
}

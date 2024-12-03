import { writable } from 'svelte/store';
import { Scene, Mesh } from 'three';

export const textContent = writable('');
export const textContentError = writable({
    errorText: '',
    errorValue: false,
});
export const nextStitchColourValue = writable('#d281fb');
export const previewCanvasScene = writable(new Scene());
export const selected3DObject = writable(null as null | Mesh);

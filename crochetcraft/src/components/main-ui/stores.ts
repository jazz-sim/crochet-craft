import { writable } from 'svelte/store';
import { Scene } from 'three';

export const uploadTextContent = writable('');
export const generalTextContent = writable('');
export const previewCanvasScene = writable(new Scene());

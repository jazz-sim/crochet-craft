import { writable } from 'svelte/store';
import { Scene } from 'three';

export const textContent = writable('');
export const previewCanvasScene = writable(new Scene());

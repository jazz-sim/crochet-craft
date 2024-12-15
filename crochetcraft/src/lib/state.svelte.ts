import { Scene, type Mesh } from 'three';

interface State {
    /** The current pattern text. */
    pattern: string;
    /** The current Three.js Scene object. */
    scene: Scene;
    /** The currently-selected 3D object, if any. */
    selectedMesh: Mesh | null;
}

const State: State = (() => {
    let pattern = $state('');
    let scene = $state(new Scene());
    let selectedMesh: Mesh | null = $state(null);

    return {
        get pattern() {
            return pattern;
        },
        set pattern(value) {
            pattern = value;
        },

        get scene() {
            return scene;
        },
        set scene(value) {
            scene = value;
        },

        get selectedMesh() {
            return selectedMesh;
        },
        set selectedMesh(value) {
            selectedMesh = value;
        },
    };
})();

export default State;

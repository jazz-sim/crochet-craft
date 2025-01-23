import { Scene, type Mesh, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface State {
    /** The current pattern text. */
    pattern: string;
    /** The current Three.js Scene object. */
    scene: Scene;
    /** The currently-selected 3D object, if any. */
    selectedMesh: Mesh | null;
    /** The OrbitControls of the current scene. */
    controls: OrbitControls | null;
    /** The camera of the current scene (need to pop it out like this to manipulate elsewhere). */
    camera: PerspectiveCamera | null;
}

const State: State = (() => {
    let pattern = $state('');
    let scene = $state(new Scene());
    let selectedMesh: Mesh | null = $state(null);
    let controls: OrbitControls | null = $state(null);
    let camera: PerspectiveCamera | null = $state(null);

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

        get controls() {
            return controls;
        },
        set controls(value) {
            controls = value;
        },

        get camera() {
            return camera;
        },
        set camera(value) {
            camera = value;
        },
    };
})();

export default State;

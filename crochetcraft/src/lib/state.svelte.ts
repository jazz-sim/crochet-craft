import { Scene, type Mesh, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface State {
    /** The current pattern text. */
    pattern: string;
    /** The current Three.js Scene object. */
    scene: Scene;
    /** The current selected meshes: */
    selectedMeshes: Mesh[];
    /** The current mesh being hovered on: */
    hoverMesh: Mesh | null;
    /** The current next stitch colour (chosen by the user): */
    nextStitchColour: string;
    /** The OrbitControls of the current scene. */
    controls: OrbitControls | null;
    /** The camera of the current scene (need to pop it out like this to manipulate elsewhere). */
    camera: PerspectiveCamera | null;
    /** The LightSwitch component for the most part handles darkmode, but here's a state for Three.js: */
    darkMode: Boolean;
}

const State: State = (() => {
    let pattern: string = $state('ch 10');
    let scene: Scene = $state(new Scene());
    let selectedMeshes: Mesh[] = $state(new Array());
    let hoverMesh: Mesh | null = $state(null);
    let nextStitchColour: string = $state('#ffffff');
    let controls: OrbitControls | null = $state(null);
    let camera: PerspectiveCamera | null = $state(null);
    let darkMode: Boolean = true;

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

        get selectedMeshes() {
            return selectedMeshes;
        },
        set selectedMeshes(value) {
            selectedMeshes = value;
        },

        get hoverMesh() {
            return hoverMesh;
        },
        set hoverMesh(value) {
            hoverMesh = value;
        },

        get nextStitchColour() {
            return nextStitchColour;
        },
        set nextStitchColour(value) {
            nextStitchColour = value;
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

        get darkMode() {
            return darkMode;
        },
        set darkMode(value) {
            darkMode = value;
        },
    };
})();

export default State;

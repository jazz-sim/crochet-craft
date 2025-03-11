import { Scene, type Mesh, PerspectiveCamera, AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface State {
    /** The current pattern text. */
    pattern: string;
    /** The current Three.js Scene object. */
    scene: Scene;
    /** The current selected meshes. */
    selectedMeshes: Mesh[];
    /** The current mesh being hovered on. */
    hoverMesh: Mesh | null;
    /** The current next stitch colour (chosen by the user). */
    nextStitchColour: string;
    /** The OrbitControls of the current scene. */
    controls: OrbitControls | null;
    /** The camera of the current scene (need to pop it out like this to manipulate elsewhere). */
    camera: PerspectiveCamera | null;
    /** The AxesHelper of the current scene. */
    axesHelper: AxesHelper | null;
    /** The selected placer algorithm: (true for IF, false for GD). */
    placerAlgo: Boolean;
}

const State: State = (() => {
    let pattern: string = $state('ch 10');
    let scene: Scene = $state(new Scene());
    let selectedMeshes: Mesh[] = $state(new Array());
    let hoverMesh: Mesh | null = $state(null);
    let nextStitchColour: string = $state('#cf80fb'); // default purple colour
    let controls: OrbitControls | null = $state(null);
    let camera: PerspectiveCamera | null = $state(null);
    let axesHelper: AxesHelper | null = $state(null);
    let placerAlgo: Boolean = $state(true);

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

        get axesHelper() {
            return axesHelper;
        },
        set axesHelper(value) {
            axesHelper = value;
        },

        get placerAlgo() {
            return placerAlgo;
        },
        set placerAlgo(value) {
            placerAlgo = value;
        },
    };
})();

export default State;

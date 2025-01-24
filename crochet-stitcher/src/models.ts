import chain from './models/chain.json';
import slipKnot from './models/slip-knot.json';
import single from './models/single.json';
import magicCircle from './models/magic-circle.json';

interface StitchModel {
    curveType: 'bezier';
    points: [number, number, number][];
}

const StitchModel = {
    CHAIN: chain as StitchModel,
    SLIP_KNOT: slipKnot as StitchModel,
    SINGLE_CROCHET: single as StitchModel,
    MAGIC_CIRCLE: magicCircle as StitchModel,
};

export default StitchModel;

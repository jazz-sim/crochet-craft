import chain from './models/chain.json';
import slipKnot from './models/slip-knot.json';
import single from './models/single.json';

interface StitchModel {
    curveType: 'bezier';
    points: [number, number, number][];
}

const StitchModel = {
    CHAIN: chain as StitchModel,
    SLIP_KNOT: slipKnot as StitchModel,
    SINGLE_CROCHET: single as StitchModel,
};

export default StitchModel;

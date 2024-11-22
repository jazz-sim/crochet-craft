import chain from './models/chain.json';
import slipKnot from './models/slip-knot.json';

interface StitchModel {
    curveType: 'bezier';
    points: [number, number, number][];
}

const StitchModel = {
    CHAIN: chain as StitchModel,
    SLIP_KNOT: slipKnot as StitchModel,
};

export default StitchModel;

import chain from './models/chain.json';

interface StitchModel {
    curveType: 'bezier';
    points: [number, number, number][];
}

const StitchModel = {
    CHAIN: chain as StitchModel,
};

export default StitchModel;

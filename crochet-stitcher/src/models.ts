import chain from './models/chain.json';
import slipKnot from './models/slip-knot.json';
import single from './models/single.json';
import magicCircle from './models/magic-circle.json';
import halfDoubleCrochet from './models/half-double-crochet.json';
import trebleCrochet from './models/treble-crochet.json';
import doubleCrochet from './models/double-crochet.json';

interface StitchModel {
    curveType: 'bezier';
    points: [number, number, number][];
}

const StitchModel = {
    CHAIN: chain as StitchModel,
    SLIP_KNOT: slipKnot as StitchModel,
    SINGLE_CROCHET: single as StitchModel,
    MAGIC_CIRCLE: magicCircle as StitchModel,
    HALF_DOUBLE_CROCHET: halfDoubleCrochet as StitchModel,
    TREBLE_CROCHET: trebleCrochet as StitchModel,
    DOUBLE_CROCHET: doubleCrochet as StitchModel,
};

export default StitchModel;

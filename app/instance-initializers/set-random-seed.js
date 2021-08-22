import { setSeed } from '../utils/random';

export function initialize(/* appInstance */) {
  // In order to make a "daily"-style challenge that's the same for everyone,
  // could do this, where we set a seed that is the same for each calendar day
  let seed = new Date().toDateString();
  console.log('NOT setting random seed to', seed);
  // setSeed(seed);
}

export default {
  initialize,
};

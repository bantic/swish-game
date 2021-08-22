import seedrandom from 'seedrandom';

let rng = seedrandom();

export function setSeed(newSeed) {
  rng = seedrandom(newSeed);
}

export function random() {
  return rng();
}

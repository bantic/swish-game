import combination from '../utils/combination';
import Card from '../utils/card';

const MIN_MATCH_SIZE = 2;
const MAX_MATCH_SIZE = 6;

// Check if cards are equal without rotation
// Used to prune out matches of 4,5,6+ cards that
// are really separable matches of 2 smaller groups
// (ie a match of size 5 that is really a match of 2 and a match of 3)
function areCardsEqual(a, b) {
  return a.toString() === b.toString();
}

function prune(matches) {
  let buckets = {};
  for (let match of matches) {
    let size = match.length;
    if (!buckets[size]) {
      buckets[size] = [];
    }
    buckets[size].push(match);
  }

  let prunedBuckets = {};
  for (let [size, matches] of Object.entries(buckets)) {
    if (!prunedBuckets[size]) {
      prunedBuckets[size] = [];
    }
    let prunedMatches = [];
    if (size <= 3) {
      prunedMatches = matches;
    } else {
      let midSize = Math.floor(size / 2);
      for (let match of matches) {
        let keepMatch = true;
        checkMatchLoop: {
          for (let i = 2; i <= midSize; i++) {
            let combos = combination(i, match);
            for (let combo of combos) {
              if (
                (buckets[i] || []).find((smallerMatch) =>
                  areCardsEqual(smallerMatch, combo)
                )
              ) {
                // skip this match
                keepMatch = false;
                break checkMatchLoop;
              }
            }
          }
        }
        if (keepMatch) {
          prunedMatches.push(match);
        }
      }
    }
    prunedBuckets[size] = prunedMatches;
  }
  return prunedBuckets;
}

export function findAllMatches(cards) {
  let matches = [];

  for (let i = MIN_MATCH_SIZE; i <= MAX_MATCH_SIZE; i++) {
    let size = i;
    let groups = combination(size, cards);
    for (let group of groups) {
      if (Card.match(group)) {
        matches.push(group);
      }
    }
  }
  return prune(matches);
}

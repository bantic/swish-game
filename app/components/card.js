import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

function getColor(col, row) {
  if ([1, 3].includes(col) && [2, 3].includes(row)) {
    return 'orange';
  }
  if ([2].includes(col) && [1, 4].includes(row)) {
    return 'green';
  }
  if ([1, 3].includes(col) && [1, 4].includes(row)) {
    return 'blue';
  }
  if ([2].includes(col) && [2, 3].includes(row)) {
    return 'purple';
  }
  throw new Error(`No color for col ${col} row ${row}`);
}

const MAX_COL = 3;
const MAX_ROW = 4;

function getOrientations(card) {
  let out = [];
  for (let v of [0, 1]) {
    for (let h of [0, 1]) {
      let orientation = `v${v}-h${h}`;
      let orientedCard = {
        hoop: { ...card.hoop },
        dot: { ...card.dot },
      };
      if (v) {
        orientedCard.hoop.col = MAX_COL - orientedCard.hoop.col + 1;
        orientedCard.dot.col = MAX_COL - orientedCard.dot.col + 1;
      }
      if (h) {
        orientedCard.hoop.row = MAX_ROW - orientedCard.hoop.row + 1;
        orientedCard.dot.row = MAX_ROW - orientedCard.dot.row + 1;
      }
      out.push([orientation, orientedCard]);
    }
  }
  return out;
}

function posEqual(a, b) {
  return a.row === b.row && a.col === b.col;
}

function canMerge(card1, card2) {
  return !posEqual(card1.hoop, card2.hoop) && !posEqual(card1.dot, card2.dot);
}

function cardMatches(card, base) {
  for (let [orientation, orientedCard] of getOrientations(card)) {
    if (
      posEqual(orientedCard.hoop, base.dot) &&
      posEqual(orientedCard.dot, base.hoop)
    ) {
      return true;
    }
  }
  return false;
}

// return int from min to max, inclusive
function randInt(min, max) {
  let range = max - min;
  let int = Math.floor(Math.random() * (1 + range)); // 0 up to range
  return min + int;
}

function getRandomPosition() {
  return {
    col: randInt(1, 3),
    row: randInt(1, 4),
  };
}

function generateCard() {
  let pos1 = getRandomPosition();
  let pos2;
  do {
    pos2 = getRandomPosition();
  } while (posEqual(pos1, pos2));

  let icon1 = { ...pos1, type: 'hoop', color: getColor(pos1.col, pos1.row) };
  let icon2 = { ...pos2, type: 'dot', color: getColor(pos2.col, pos2.row) };
  return [icon1, icon2];
}

export default class CardComponent extends Component {
  @tracked selected = false;

  constructor(owner, args) {
    super(owner, args);
    this.icons = generateCard();
  }

  @action toggleSelect() {
    this.selected = !this.selected;
    console.log('selected!', this.selected);
  }
}

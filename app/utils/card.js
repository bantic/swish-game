import { assert } from '@ember/debug';

const MAX_COL = 3;
const MAX_ROW = 4;
const ALL_TYPES = ['hoop', 'dot'];

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

function allLeafPaths(tree) {
  let allPaths = [];
  traverse(tree, [], allPaths);
  return allPaths;
}

function traverse(node, path, allPaths) {
  path.push(node.value);
  if (node.children.length === 0) {
    allPaths.push(path.slice());
  }
  for (let child of node.children) {
    traverse(child, path.slice(), allPaths);
  }
}

export function generateRotationCombinations(cards) {
  if (cards.length === 0) {
    return [];
  }
  let [base, ...rest] = cards;
  let makeNode = (v) => ({ value: v, children: [] });
  let tree = makeNode(base);
  let nodes = [tree];
  for (let card of rest) {
    let leaves = [];
    for (let orientation of card.orientations) {
      for (let node of nodes) {
        let newNode = makeNode(orientation);
        leaves.push(newNode);
        node.children.push(newNode);
      }
    }
    nodes = leaves;
  }
  return allLeafPaths(tree);
}

function posEqual(a, b) {
  return a.row === b.row && a.col === b.col;
}

function isArrayContentsEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  a = a.slice().sort();
  b = b.slice().sort();
  return a.every((v, idx) => {
    return b[idx] === v;
  });
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

export class Icon {
  constructor(position, type) {
    this.position = position;
    assert(`unexpected type ${type}`, ALL_TYPES.includes(type));
    this.type = type;
  }

  get col() {
    return this.position.col;
  }

  get row() {
    return this.position.row;
  }

  get color() {
    return getColor(this.col, this.row);
  }
}

export default class Card {
  constructor(icons, orientation = { v: false, h: false }) {
    this.icons = icons;
    this.orientation = orientation;
  }

  static random() {
    let pos1 = getRandomPosition();
    let pos2;
    do {
      pos2 = getRandomPosition();
    } while (posEqual(pos1, pos2));

    let icon1 = new Icon(pos1, 'hoop');
    let icon2 = new Icon(pos2, 'dot');
    return new Card([icon1, icon2]);
  }

  static match(cards) {
    if (cards.length < 2) {
      return false;
    }
    let combos = generateRotationCombinations(cards);

    for (let combo of combos) {
      let [base, ...rest] = combo;
      let merged = base;
      for (let card of rest) {
        merged = merged.merge(card);
      }
      if (merged.isMatch) {
        return true;
      }
    }

    return false;
  }

  merge(other) {
    return new Card([...this.icons, ...other.icons]);
  }

  get isValid() {
    for (let [_idx, icons] of Object.entries(this.slots)) {
      if (icons.length > 2) {
        return false;
      }
      if (icons.length === 2) {
        let types = icons.map((i) => i.type);
        if (!isArrayContentsEqual(types, ALL_TYPES)) {
          return false;
        }
      }
    }
    return true;
  }

  get isMatch() {
    if (!this.isValid) {
      return false;
    }
    for (let [_idx, icons] of Object.entries(this.slots)) {
      if (icons.length === 0) {
        continue;
      } else if (icons.length !== 2) {
        return false;
      } else {
        let types = icons.map((i) => i.type);
        if (!isArrayContentsEqual(types, ALL_TYPES)) {
          return false;
        }
      }
    }
    return true;
  }

  at(col, row) {
    let idx = `col-${col}-row-${row}`;
    return this.slots[idx];
  }

  flipV() {
    assert(
      `Cannot flipV a card that is already flipped vertically`,
      !this.orientation.v
    );
    let orientation = { v: true, h: this.orientation.h };
    let icons = this.icons.map((icon) => {
      return new Icon(
        {
          row: 1 + MAX_ROW - icon.row,
          col: icon.col,
        },
        icon.type
      );
    });
    return new Card(icons, orientation);
  }

  reorient() {
    return new Card([...this.icons], { h: false, v: false });
  }

  get orientations() {
    return [this, this.flipV(), this.flipH(), this.flipV().flipH()];
  }

  flipH() {
    assert(
      `Cannot flipH a card that is already flipped horizontally`,
      !this.orientation.h
    );
    let orientation = { v: this.orientation.v, h: true };
    let icons = this.icons.map((icon) => {
      return new Icon(
        {
          row: icon.row,
          col: 1 + MAX_COL - icon.col,
        },
        icon.type
      );
    });
    return new Card(icons, orientation);
  }

  get slots() {
    let slots = {};

    for (let col = 1; col <= MAX_COL; col++) {
      for (let row = 1; row <= MAX_ROW; row++) {
        let idx = `col-${col}-row-${row}`;
        slots[idx] = [];
      }
    }

    for (let icon of this.icons) {
      let { col, row } = icon;
      let idx = `col-${col}-row-${row}`;
      slots[idx].push(icon);
    }

    return slots;
  }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';
import Card from '../utils/card';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { findAllMatches } from '../utils/find-all-matches';

export default class GameComponent extends Component {
  @tracked score = 0;
  @tracked cards = [];
  @tracked matches;
  selection = [];
  MIN_CARDS = 16;

  constructor(owner, args) {
    super(owner, args);
    this.deal();
  }

  clearSelection() {
    this.cards = this.cards.filter((card) => !this.selection.includes(card));
    this.selection = [];
  }

  deal() {
    // TODO something about using cards here causes a computation deprecation warning
    // about changing a value after it was used for computation
    if (this.cards.length >= this.MIN_CARDS) {
      return;
    } else {
      this.cards = [
        ...this.cards,
        ...new Array(this.MIN_CARDS - this.cards.length)
          .fill(0)
          .map(() => Card.random()),
      ];
      console.time('find-all-matches');
      let matches = findAllMatches(this.cards);
      console.timeEnd('find-all-matches');
      this.matches = matches;
    }
  }

  @action
  submit() {
    if (Card.match(this.selection)) {
      this.score += this.selection.length;
      this.clearSelection();
      this.deal();
    } else {
      this.score -= 1;
    }
  }

  @action
  onSelect(card, isSelected) {
    if (isSelected) {
      assert(`Cannot re-select card`, !this.selection.includes(card));
      this.selection.push(card);
    } else {
      assert(`Cannot deselect unselected card`, this.selection.includes(card));
      this.selection = this.selection.filter((c) => c !== card);
    }
    if (Card.match(this.selection)) {
      console.log('got a match!');
    }
  }
}

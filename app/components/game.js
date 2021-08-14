import Component from '@glimmer/component';
import { action } from '@ember/object';
import Card from '../utils/card';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

export default class GameComponent extends Component {
  @tracked score = 0;
  @tracked cards = [];
  selection = [];
  MIN_CARDS = 8;

  constructor(owner, args) {
    super(owner, args);
    this.cards = new Array(this.MIN_CARDS).fill(0).map(() => Card.random());
  }

  clearSelection() {
    this.cards = this.cards.filter((card) => !this.selection.includes(card));
    this.selection = [];
  }

  redeal() {
    if (this.cards.length >= this.MIN_CARDS) {
      return;
    } else {
      this.cards = [
        ...this.cards,
        ...new Array(this.MIN_CARDS - this.cards.length)
          .fill(0)
          .map(() => Card.random()),
      ];
    }
  }

  @action
  dealMore() {
    this.cards = [...this.cards, Card.random()];
  }

  @action
  submit() {
    if (Card.match(this.selection)) {
      this.score += this.selection.length;
      this.clearSelection();
      this.redeal();
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

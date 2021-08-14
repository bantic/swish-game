import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Card from '../utils/card';

export default class CardComponent extends Component {
  @tracked selected = false;

  constructor(owner, args) {
    super(owner, args);
    this.card = args.card ?? Card.random();
  }

  @action toggleSelect() {
    this.selected = !this.selected;
    this.args.onSelect?.(this.card, this.selected);
  }
}

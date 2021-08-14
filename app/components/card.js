import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Card from '../utils/card';
import { assert } from '@ember/debug';

export default class CardComponent extends Component {
  @tracked selected = false;
  @tracked flipV = false;
  @tracked flipH = false;

  constructor(owner, args) {
    super(owner, args);
    this.card = args.card ?? Card.random();
  }

  _doSelect() {
    this.selected = true;
    this.args.onSelect?.(this.card, true);
  }

  _doUnselect() {
    this.selected = false;
    this.args.onSelect?.(this.card, false);
  }

  @action handleClick() {
    if (!this.selected) {
      this._doSelect();
    } else {
      let v = this.flipV;
      let h = this.flipH;
      // v0-h0 -> v1-h0
      // v1-h0 -> v1-h1
      // v1-h1 -> v0-h1
      // v0-h1 -> v0-h0 (deselect)
      if (!v && !h) {
        this.flipV = true;
      } else if (v && !h) {
        this.flipH = true;
      } else if (v && h) {
        this.flipV = false;
      } else if (!v && h) {
        this.flipH = false;
        this._doUnselect();
      } else {
        assert(`Unexpected condition`, false);
      }
    }
  }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GameComponent extends Component {
  @action
  selectCard() {
    console.log('selected card!');
  }
}

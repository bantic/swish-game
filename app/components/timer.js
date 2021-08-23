import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

function padLeft(str, len, padding) {
  let out = str;
  while (out.length < len) {
    out = `${padding}${out}`;
  }
  return out;
}

export default class TimerComponent extends Component {
  @tracked startedAt;
  @tracked elapsed;

  constructor(owner, args) {
    super(owner, args);
    this.startedAt = Date.now();
    this.run();
  }

  run() {
    this.elapsed = Date.now() - this.startedAt;
    if (this.isRunning) {
      requestAnimationFrame(() => this.run());
    }
  }

  get isRunning() {
    return this.args.isRunning;
  }

  get formattedElapsed() {
    let elapsed = this.elapsed;
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    let seconds = Math.floor(elapsed / SECOND);
    let minutes = Math.floor((elapsed - seconds * SECOND) / MINUTE);
    return `${padLeft('' + minutes, 2, '0')}:${padLeft('' + seconds, 2, '0')}`;
  }
}

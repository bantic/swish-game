# swish

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## TODOs

- speed up match-finding, or move it off the main thread via web worker
- better styling for the match UI
- make a daily challenge -- time-based? or generate a set of card with pre-determined number of 2,3,4 matches etc
  - this is partially done -- the custom `random` is implemented, it just needs to be turned on
- Add "clear" button (Manage selection state in game component to do so?)
- Game controls:
  - Timing (?)
  - reset score, start again (aka reload)
- Multiplayer?
- Challenge mode: Get all matches as fast as possible no re-dealing

### TODOs Done

- Deploy via Vercel (just git push)
- use custom `random` implementation that can be seeded so that there can be a daily challenge

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://ember-cli.com/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone <repository-url>` this repository
- `cd swish`
- `npm install`

## Running / Development

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

- `ember test`
- `ember test --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `ember build` (development)
- `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://ember-cli.com/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

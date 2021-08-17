import Card, { Icon, generateRotationCombinations } from 'swish/utils/card';
import { module, test } from 'qunit';

module('Unit | Utility | card', function () {
  test('random cards are valid', function (assert) {
    let cards = new Array(50).fill(null).map(() => Card.random());
    assert.ok(cards.every((c) => c.isValid));
  });

  test('#match works, no rotation', function (assert) {
    let match;
    let card1 = new Card([
      new Icon({ col: 1, row: 1 }, 'hoop'),
      new Icon({ col: 2, row: 1 }, 'dot'),
    ]);
    let card2 = new Card([
      new Icon({ col: 1, row: 1 }, 'dot'),
      new Icon({ col: 2, row: 1 }, 'hoop'),
    ]);

    match = Card.match([card1, card2]);
    assert.ok(match, 'matches');

    // conflict
    match = Card.match([card1, card1]);
    assert.notOk(match, 'nomatch card1');

    // conflict
    match = Card.match([card2, card2]);
    assert.notOk(match, 'nomatch card2');
  });

  test('#flipV', function (assert) {
    let card = new Card([
      new Icon({ col: 1, row: 1 }, 'dot'),
      new Icon({ col: 3, row: 1 }, 'hoop'),
    ]);

    let cardV = card.flipV();
    assert.deepEqual(cardV.orientation, { v: true, h: false });
    assert.equal(cardV.icons.length, 2);
    assert.equal(cardV.at(1, 4).length, 1);
    assert.equal(cardV.at(3, 4).length, 1);
    assert.deepEqual(cardV.at(1, 4)[0].position, { col: 1, row: 4 });
    assert.deepEqual(cardV.at(3, 4)[0].position, { col: 3, row: 4 });

    // color doesn't change when reorienting
    assert.equal(cardV.at(1, 4)[0].color, card.at(1, 1)[0].color);
    assert.equal(cardV.at(3, 4)[0].color, card.at(3, 1)[0].color);
  });

  test('#flipH', function (assert) {
    let card = new Card([
      new Icon({ col: 1, row: 1 }, 'dot'),
      new Icon({ col: 3, row: 1 }, 'hoop'),
    ]);

    let cardH = card.flipH();
    assert.deepEqual(cardH.orientation, { v: false, h: true });
    assert.equal(cardH.icons.length, 2);
    assert.equal(cardH.at(3, 1).length, 1);
    assert.equal(cardH.at(1, 1).length, 1);
    assert.deepEqual(cardH.at(3, 1)[0].position, { col: 3, row: 1 });
    assert.deepEqual(cardH.at(1, 1)[0].position, { col: 1, row: 1 });

    // color doesn't change when reorienting
    assert.equal(cardH.at(3, 1)[0].color, card.at(1, 1)[0].color);
    assert.equal(cardH.at(1, 1)[0].color, card.at(3, 1)[0].color);
  });

  // eslint-disable-next-line qunit/require-expect
  test('#generateRotationCombinations', function (assert) {
    let cards = [
      new Card([
        new Icon({ col: 1, row: 1 }, 'dot'),
        new Icon({ col: 3, row: 1 }, 'hoop'),
      ]),
      new Card([
        new Icon({ col: 2, row: 2 }, 'dot'),
        new Icon({ col: 3, row: 3 }, 'hoop'),
      ]),
    ];

    let combos = generateRotationCombinations(cards);
    assert.equal(combos.length, 4);
    assert.ok(
      combos.every(
        (combo) =>
          combo[0].orientation.h === false && combo[0].orientation.v === false
      )
    );
    let orientations = [];
    for (let h of [true, false]) {
      for (let v of [true, false]) {
        orientations.push({ v, h });
      }
    }
    for (let orientation of orientations) {
      assert.ok(
        combos.find(
          (combo) =>
            combo[1].orientation.v === orientation.v &&
            combo[1].orientation.h === orientation.h
        )
      );
    }
  });

  test('#match works, with rotation', function (assert) {
    let match;
    let card1 = new Card([
      new Icon({ col: 1, row: 1 }, 'dot'),
      new Icon({ col: 3, row: 1 }, 'hoop'),
    ]);

    // card2 must be flipped vertically
    let card2 = new Card([
      new Icon({ col: 1, row: 4 }, 'hoop'),
      new Icon({ col: 3, row: 4 }, 'dot'),
    ]);

    match = Card.match([card1, card2]);
    assert.ok(match);

    // card3 must be flipped horizontally
    let card3 = new Card([
      new Icon({ col: 3, row: 1 }, 'hoop'),
      new Icon({ col: 1, row: 1 }, 'dot'),
    ]);
    match = Card.match([card1, card3]);
    assert.ok(match);
  });

  test('#match with more than 2 cards', function (assert) {
    let cards = [
      new Card([
        new Icon({ col: 2, row: 1 }, 'hoop'),
        new Icon({ col: 3, row: 4 }, 'dot'),
      ]),
      new Card([
        new Icon({ col: 3, row: 4 }, 'hoop'),
        new Icon({ col: 1, row: 2 }, 'dot'),
      ]),
      new Card([
        new Icon({ col: 1, row: 2 }, 'hoop'),
        new Icon({ col: 2, row: 1 }, 'dot'),
      ]),
    ];
    assert.ok(Card.match(cards));

    cards = [cards[0], cards[1], cards[2].flipV().reorient()];
    assert.ok(Card.match(cards));

    cards = [cards[0], cards[1], cards[2].flipH().reorient()];
    assert.ok(Card.match(cards));

    cards = [cards[0], cards[1], cards[2].flipH().flipV().reorient()];
    assert.ok(Card.match(cards));

    cards = [cards[0], cards[1], cards[1]];
    assert.notOk(Card.match(cards));

    cards = [
      cards[0],
      // shift card slightly
      new Card([
        new Icon({ col: 2, row: 4 }, 'hoop'),
        new Icon({ col: 1, row: 3 }, 'dot'),
      ]),
      cards[2],
    ];
    assert.notOk(Card.match(cards));
  });
});

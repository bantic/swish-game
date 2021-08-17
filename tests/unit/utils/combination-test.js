import combination from 'swish/utils/combination';
import { module, test } from 'qunit';

function arrayEquals(a1, a2) {
  a1 = a1.slice().sort();
  a2 = a2.slice().sort();
  return a1.length === a2.length && a1.every((v, idx) => a2[idx] === v);
}

function arrayIncludes(arrOfArr, arr) {
  return arrOfArr.find((item) => arrayEquals(item, arr));
}

function arrayIsUnique(arr) {
  arr = arr.map((item) => item.toString());
  let set = new Set(arr);
  return Array.from(set).length === arr.length;
}

module('Unit | Utility | combination', function () {
  // eslint-disable-next-line qunit/require-expect
  test('combo of 2', function (assert) {
    let result = combination(2, [1, 2, 3, 4]);
    let expected = [
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [3, 4],
    ];

    expected.forEach((expectedCombo) => {
      assert.ok(arrayIncludes(result, expectedCombo), `${expectedCombo}`);
    });
    assert.ok(arrayIsUnique(result));
    assert.equal(result.length, 6);
  });

  // eslint-disable-next-line qunit/require-expect
  test('combo of 3', function (assert) {
    let result = combination(3, [1, 2, 3, 4]);
    let expected = [
      [1, 2, 3],
      [1, 3, 4],
      [2, 3, 4],
    ];

    expected.forEach((expectedCombo) => {
      assert.ok(arrayIncludes(result, expectedCombo), `${expectedCombo}`);
    });
    assert.ok(arrayIsUnique(result));
    assert.equal(result.length, 4);
  });

  // eslint-disable-next-line qunit/require-expect
  test('combo of 4', function (assert) {
    let result = combination(4, [1, 2, 3, 4, 5, 6, 7, 8]);
    // sampling
    let expected = [
      [1, 2, 3, 4],
      [1, 3, 4, 5],
      [1, 3, 4, 6],
      [1, 3, 5, 6],
      [2, 3, 4, 5],
      [2, 3, 4, 8],
      [2, 3, 5, 8],
      [2, 3, 6, 8],
      [2, 3, 7, 8],
      [3, 4, 5, 8],
    ];

    expected.forEach((expectedCombo) => {
      assert.ok(arrayIncludes(result, expectedCombo), `${expectedCombo}`);
    });
    assert.equal(result.length, 70);
  });
});

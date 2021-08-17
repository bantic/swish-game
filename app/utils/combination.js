export default function combination(len, items) {
  if (len === 0) {
    return [];
  }
  if (len === 1) {
    return items.map((i) => [i]);
  }
  let combos = [];
  for (let i = 0; i < items.length - len + 1; i++) {
    let base = items[i];
    let rest = items.slice(i + 1);
    combination(len - 1, rest).forEach((combo) => {
      combos.push([base, ...combo]);
    });
  }
  return combos;
}

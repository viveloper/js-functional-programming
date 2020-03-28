function* gen() {
  for (let i = 1; i <= 10; i++) {
    i % 2 ? yield i : null;
  }
  return 'hello';
}

// const iter = gen();
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// for (const v of iter) {
//   console.log(v);
// }

function* infinity(i = 0) {
  while (true) {
    yield i++;
  }
}

function* limit(max, iter) {
  for (const v of iter) {
    yield v;
    if (v === max) return;
  }
}

function* odds(max) {
  for (const v of limit(max, infinity())) {
    if (v % 2) yield v;
  }
}

for (const v of odds(40)) {
  console.log(v);
}

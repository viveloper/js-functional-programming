// const arr = [1, 2, 3];
// const iter = arr[Symbol.iterator]();
// console.log(iter.next());
// for (const v of iter) {
//   console.log(v);
// }

// const set = new Set([1, 2, 3]);
// console.log(set[Symbol.iterator]);
// for (const v of set) {
//   console.log(v);
// }

// const map = new Map([
//   ['a', 1],
//   ['b', 2],
//   ['c', 3]
// ]);
// console.log(map[Symbol.iterator]);
// for (const v of map) {
//   console.log(v);
// }

// const obj = {
//   values: [1, 2, 3],
//   [Symbol.iterator]: function() {
//     const iterator = {
//       index: -1,
//       values: this.values,
//       next: function() {
//         this.index++;
//         if (this.index < this.values.length) {
//           return {
//             value: this.values[this.index],
//             done: false
//           };
//         } else {
//           return {
//             value: undefined,
//             done: true
//           };
//         }
//       },
//       [Symbol.iterator]: function() {
//         return this;
//       }
//     };
//     return iterator;
//   }
// };
// const iter = obj[Symbol.iterator]();
// // console.log(iter.next());
// // console.log(iter.next());
// // console.log(iter.next());
// iter.next();

// for (const v of iter) {
//   console.log(v);
// }

// function* gen() {
//   for (let i = 1; i <= 10; i++) {
//     i % 2 ? yield i : null;
//   }
//   return 'hello';
// }

// const iter = gen();
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// for (const v of iter) {
//   console.log(v);
// }

// function* infinity(i = 0) {
//   while (true) {
//     yield i++;
//   }
// }

// function* limit(max, iter) {
//   for (const v of iter) {
//     yield v;
//     if (v === max) return;
//   }
// }

// function* odds(max) {
//   for (const v of limit(max, infinity())) {
//     if (v % 2) yield v;
//   }
// }

// for (const v of odds(40)) {
//   console.log(v);
// }

const products = [
  { name: 'D850', price: 290 },
  { name: 'D810', price: 180 },
  { name: 'D750', price: 140 },
  { name: 'D7200', price: 100 },
  { name: '6D Mark2', price: 120 },
  { name: 'M5', price: 50 },
  { name: 'D-LUX Typ114', price: 140 }
];

function map(fn, iter) {
  const result = [];
  for (const item of iter) {
    result.push(fn(item));
  }
  return result;
}

// const names = map(p => p.name, products);
// const prices = map(p => p.price, products);
// console.log(names);
// console.log(prices);

function filter(fn, iter) {
  const result = [];
  for (const item of iter) {
    fn(item) && result.push(item);
  }
  return result;
}

// const under120 = filter(p => p.price <= 120, products);
// console.log(under120);

function reduce(fn, memo, iter) {
  if (!iter) {
    iter = memo[Symbol.iterator]();
    memo = iter.next().value;
  }
  for (const item of iter) {
    memo = fn(memo, item);
  }
  return memo;
}

// const totalPrice = reduce((sum, p) => sum + p.price, 0, products);
// console.log(totalPrice);

// console.log(reduce((memo, p) => memo + p, [1, 2, 3, 4, 5]));

const go = (...args) => reduce((arg, fn) => fn(arg), args);

go(
  1,
  a => a + 1,
  a => a * 2,
  console.log
);

const pipe = (...fns) => arg => go(arg, ...fns);

console.log(
  pipe(
    a => a + 1,
    a => a * 2,
    a => a * a
  )(1)
);

const curry = fn => (a, ...args) =>
  args.length ? fn(a, ...args) : b => fn(a, b);

map = curry(map);
filter = curry(filter);
reduce = curry(reduce);

go(
  products,
  prices => filter(p => p.price < 150, prices),
  products => map(p => p.price, products),
  prices => reduce((total, p) => total + p, prices),
  console.log
);

go(
  products,
  filter(p => p.price < 150),
  map(p => p.price),
  reduce((total, p) => total + p),
  console.log
);

const getTotalPrice = pipe(
  map(p => p.price),
  reduce((total, p) => total + p)
);

go(
  products,
  filter(p => p.price < 150),
  getTotalPrice,
  console.log
);

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

// curry
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

// Lazy
const L = {};

// range
const range = length => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
};

console.log(reduce((sum, item) => sum + item, 0, range(10)));

// L.range
L.range = function*(length) {
  for (let i = 0; i < length; i++) {
    yield i;
  }
};

console.log(reduce((sum, item) => sum + item, 0, L.range(10)));

// take
const take = curry((len, iter) => {
  const res = [];
  for (const value of iter) {
    res.push(value);
    if (res.length === len) return res;
  }
  return res;
});

console.time('');
go(
  range(10000),
  take(5),
  reduce((sum, item) => sum + item),
  console.log
);
console.timeEnd('');
console.time('');
go(
  L.range(10000),
  take(5),
  reduce((sum, item) => sum + item),
  console.log
);
console.timeEnd('');

console.clear();

// L.map
L.map = curry(function*(fn, iter) {
  let index = 0;
  for (const value of iter) {
    yield fn(value, index++);
  }
});

const iterAdded10 = L.map(item => item + 10, [1, 2, 3, 4, 5]);
console.log(iterAdded10.next());
console.log(iterAdded10.next());
console.log([...iterAdded10]);

// L.filter
L.filter = curry(function*(fn, iter) {
  for (const value of iter) {
    if (fn(value)) yield value;
  }
});

const iterOdds = L.filter(item => item % 2, [1, 2, 3, 4, 5]);
console.log(iterOdds.next());
console.log(iterOdds.next());
console.log([...iterOdds]);

console.clear();

// 중첩 사용 예시
go(
  range(10),
  map(n => n + 10),
  filter(n => n % 2),
  take(2),
  console.log
);

go(
  L.range(10),
  L.map(n => n + 10),
  L.filter(n => n % 2),
  take(2),
  console.log
);

// queryStr
const join = curry((sep = ' ', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);

L.entries = function*(obj) {
  for (const key in obj) {
    yield [key, obj[key]];
  }
};

const queryStr = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join('&')
);

console.log(queryStr({ limit: 10, offset: 10, type: 'notice' }));

// find
const find = curry((fn, iter) => go(iter, L.filter(fn), take(1), ([a]) => a));

console.log(find(p => p.price < 200)(products));

go(
  products,
  L.map(p => p.price),
  find(p => p < 200),
  console.log
);

// map
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

const takeAll = take(infinity);

map = curry((fn, iter) => go(iter, L.map(fn), takeAll));
filter = curry((fn, iter) => go(iter, L.filter(fn), takeAll));

console.log(map(a => a + 10)([1, 2, 3, 4, 5]));
console.log(filter(a => a < 3)([1, 2, 3, 4, 5]));

// flatten
L.flatten = function*(arr) {
  for (const value of arr) {
    if (Array.isArray(value)) {
      for (const item of value) {
        yield item;
      }
    } else {
      yield value;
    }
  }
};

const iterFlatten = L.flatten([1, 2, [3, 4], 5, 6, 7, 8, [9, 10], 11]);

console.log([...iterFlatten]);
// console.log(iterFlatten.next());
// console.log(iterFlatten.next());

flatten = arr => go(arr, L.flatten, takeAll);

console.log(flatten([1, 2, [3, 4], 5, 6, 7, 8, [9, 10], 11]));

// Deep Flat
function deepFlat(arr) {
  let res = [];
  for (const value of arr) {
    if (Array.isArray(value)) {
      res = res.concat(deepFlat(value));
    } else {
      res.push(value);
    }
  }
  return res;
}

console.log(deepFlat([1, 2, [3, 4], 5, 6, 7, 8, [9, [10, 11, 12], 13], 14]));

L.deepFlat = function* lazyDeepFlat(arr) {
  for (const value of arr) {
    if (Array.isArray(value)) {
      yield* lazyDeepFlat(value);
    } else {
      yield value;
    }
  }
};

// console.log([
//   ...L.deepFlat([1, 2, [3, 4], 5, 6, 7, 8, [9, [10, 11, 12], 13], 14])
// ]);

const iterDeepFlat = L.deepFlat([
  1,
  2,
  [3, 4],
  5,
  6,
  7,
  8,
  [9, [10, 11, 12], 13],
  14
]);
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());
console.log(iterDeepFlat.next());

// flatMap
console.log(
  [1, 2, [3, 4], 5, 6, 7, 8, [9, [10, 11, 12], 13], 14].flatMap(a => a)
);

L.flatMap = curry((fn, iter) => go(iter, L.deepFlat, L.map(fn)));

const flatMap = curry((fn, iter) => go(iter, L.flatMap(fn), takeAll));

console.log(
  flatMap(a => a + 10)([1, 2, [3, 4], 5, 6, 7, 8, [9, [10, 11, 12], 13], 14])
);

console.log(flatMap(range, [1, 2, 3]));

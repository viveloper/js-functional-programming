const users = [
  { id: 1, name: 'ID', age: 36 },
  { id: 2, name: 'BJ', age: 32 },
  { id: 3, name: 'JM', age: 32 },
  { id: 4, name: 'PJ', age: 27 },
  { id: 5, name: 'HA', age: 25 },
  { id: 6, name: 'JE', age: 26 },
  { id: 7, name: 'JI', age: 31 },
  { id: 8, name: 'MP', age: 23 }
];

/** forEach */
function _forEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i, arr);
  }
}

/** filter */
function _filter(arr, fn) {
  const result = [];
  _forEach(arr, (item, index) => {
    fn(item, index, arr) && result.push(item);
  });
  return result;
}

/** map */
function _map(arr, fn) {
  const result = [];
  _forEach(arr, (item, index) => {
    result.push(fn(item, index, arr));
  });
  return result;
}

/** 커링 (curry, curryr) */
/** curry */
function _curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}
/** curryr */
function _curryr(fn) {
  return function(a) {
    return function(b) {
      return fn(b, a);
    };
  };
}

const add = (a, b) => a + b;
const sub = (a, b) => a - b;

const f1 = _curry(add);
const add10 = f1(10);

const f2 = _curryr(sub);
const sub7 = f2(7);

/** get */
const _get = _curryr((obj, key) => {
  return obj === null ? undefined : obj[key];
});

/** reduce */
function _reduce(arr, fn, memo) {
  _forEach(arr, (item, index) => {
    memo = fn(memo, item, index, arr);
  });
  return memo;
}

/** Pipeline (pipe, go) */
/** pipe */
function _pipe() {
  const fns = arguments;
  return function(arg) {
    return _reduce(
      fns,
      (arg, fn) => {
        return fn(arg);
      },
      arg
    );
  };
}

const f3 = _pipe(
  a => a + 1,
  a => a * 2,
  a => a * a
);

/** go */
function _go(arg) {
  const fns = Array.prototype.slice.call(arguments, 1);
  return _pipe(...fns)(arg);
}

_go(
  1,
  a => a + 1,
  a => a * 2,
  a => a * a,
  console.log
);

/** 함수형 프로그래밍의 활용 */
// 나이가 30 이상인 유저의 이름 배열
console.log(
  _map(
    _filter(users, user => user.age >= 30),
    user => user.name
  )
);

_go(
  users,
  _curryr(_filter)(user => user.age >= 30),
  _curryr(_map)(_get('name')),
  console.log
);

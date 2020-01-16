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

// 명령형 코드
// 1. 30세 이상인 유저를 거른다.
var temp_users = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    temp_users.push(users[i]);
  }
}
console.log(temp_users);

// 2. 30세 이상인 유저의 이름을 수집한다.
var names = [];
for (let i = 0; i < temp_users.length; i++) {
  names.push(temp_users[i].name);
}
console.log(names);

// 3. 30세 미만인 유저를 거른다.
var temp_users = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    temp_users.push(users[i]);
  }
}
console.log(temp_users);

// 4. 30세 미만인 유저의 나이를 수집한다.
var ages = [];
for (let i = 0; i < temp_users.length; i++) {
  ages.push(temp_users[i].age);
}
console.log(ages);


// _filter, _map으로 리팩토링
var _filter = function (list, predi) {
  var new_list = [];
  for (let i = 0; i < list.length; i++) {
    if (predi(list[i])) {
      new_list.push(list[i]);
    }
  }
  return new_list;
}

var _map = function (list, mapper) {
  var new_list = [];
  for (let i = 0; i < list.length; i++) {
    new_list.push(mapper(list[i]));
  }
  return new_list;
}

// 1. 30세 이상인 유저를 거른다.
var temp_users = _filter(users, user => user.age >= 30);
console.log(temp_users);

// 2. 30세 이상인 유저의 이름을 수집한다.
var names = _map(temp_users, user => user.name);
console.log(names);

// 3. 30세 미만인 유저를 거른다.
var temp_users = _filter(users, user => user.age < 30);
console.log(temp_users);

// 4. 30세 미만인 유저의 나이를 수집한다.
var names = _map(temp_users, user => user.age);
console.log(names);


// each 만들기
// 1. _each로 _filter, _map 중복 코드 제거
var _each = function (list, iter) {
  for (let i = 0; i < list.length; i++) {
    iter(list[i]);
  }
  return list;
}

var _filter = function (list, predi) {
  var new_list = [];
  _each(list, item => {
    if (predi(item)) {
      new_list.push(item);
    }
  });
  return new_list;
}

var _map = function (list, mapper) {
  var new_list = [];
  _each(list, item => {
    new_list.push(mapper(item));
  });
  return new_list;
}

// 1. 30세 이상인 유저를 거른다.
var temp_users = _filter(users, user => user.age >= 30);
console.log(temp_users);

// 2. 30세 이상인 유저의 이름을 수집한다.
var names = _map(temp_users, user => user.name);
console.log(names);

// 3. 30세 미만인 유저를 거른다.
var temp_users = _filter(users, user => user.age < 30);
console.log(temp_users);

// 4. 30세 미만인 유저의 나이를 수집한다.
var names = _map(temp_users, user => user.age);
console.log(names);


// 커링, curry, curryr
var _curry = function (fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : function (b) { return fn(a, b) }
  }
}

var _curryr = function (fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : function (b) { return fn(b, a) }
  }
}

var add = _curry((a, b) => a + b);

var sub = _curry((a, b) => a - b);

console.log(
  add(10)(20)
)
console.log(
  sub(10)(20)
)
console.log(
  add(10, 20)
)
console.log(
  sub(10, 20)
)

var add = _curryr((a, b) => a + b);

var sub = _curryr((a, b) => a - b);

console.log(
  add(10)(20)
)
console.log(
  sub(10)(20)
)

// _get 만들어 좀 더 간단하고 안전하게 하기
var _get = function (obj, key) {
  return obj ? obj[key] : undefined;
}

console.log(
  _get(users[0], 'name')
)

// _get에 curryr 적용
var _get = _curryr(function (obj, key) {
  return obj ? obj[key] : undefined;
})

console.log(
  _get(users[0], 'name')
)
console.log(
  _get('name')(users[0])
)

var getName = _get('name');

console.log(
  getName(users[1])
)

// curryr을 적용함으로써 이런게 가능해짐
var names = _map(users, user => user.name);
console.log(names);

var names = _map(users, _get('name'));
console.log(names);

var names = _map(users, user => user.age);
console.log(names);

var names = _map(users, _get('age'));
console.log(names);


// _reduce 만들기
var _reduce = function (list, iter, memo) {
  _each(list, item => {
    memo = iter(memo, item);
  });
  return memo;
}

console.log(
  _reduce([1, 2, 3], (memo, item) => {
    return memo + item;
  }, 0)
)

console.log(
  _reduce(users, (memo, user) => {
    memo.push(user.name);
    return memo;
  }, [])
)

console.log(
  _reduce(users, (memo, user) => {
    memo.names.push(user.name);
    return memo;
  }, { names: [] })
)

// _reduce에 memo 인자 생략 가능하도록 수정(list의 첫번째 값을 memo로 사용)
var slice = Array.prototype.slice;
var _rest = function (list, num) {
  return slice.call(list, num);
}

var _reduce = function (list, iter, memo) {
  if (!memo) {
    memo = list[0];
    list = _rest(list, 1);
  }
  _each(list, item => {
    memo = iter(memo, item);
  });
  return memo;
}

console.log(
  _reduce([1, 2, 3], (memo, val) => {
    return memo + val;
  })
)

console.log(
  _reduce([1, 2, 3], (memo, val) => {
    return memo + val;
  }, 10)
)
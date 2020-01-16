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
const arr = [1, 2, 3];
const iter = arr[Symbol.iterator]();
console.log(iter.next());
for (const v of iter) {
  console.log(v);
}

const set = new Set([1, 2, 3]);
console.log(set[Symbol.iterator]);
for (const v of set) {
  console.log(v);
}

const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);
console.log(map[Symbol.iterator]);
for (const v of map) {
  console.log(v);
}

const obj = {
  values: [1, 2, 3],
  [Symbol.iterator]: function() {
    const iterator = {
      index: -1,
      values: this.values,
      next: function() {
        this.index++;
        if (this.index < this.values.length) {
          return {
            value: this.values[this.index],
            done: false
          };
        } else {
          return {
            value: undefined,
            done: true
          };
        }
      },
      [Symbol.iterator]: function() {
        return this;
      }
    };
    return iterator;
  }
};
// const iter = obj[Symbol.iterator]();
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// iter.next();

for (const v of iter) {
  console.log(v);
}

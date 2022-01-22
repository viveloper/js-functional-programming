const getPersonName = (person) => person.name;
const getUppercase = (str) => str.toUpperCase();
const get4Characters = (str) => str.slice(0, 4);

const compose =
  (...fns) =>
  (value) => {
    let nextValue = value;
    while (fns.length > 0) {
      const fn = fns.pop();
      nextValue = fn(nextValue);
    }
    return nextValue;
  };

// 'HONG'
compose(
  console.log,
  get4Characters,
  getUppercase,
  getPersonName
)({ name: 'Hong Gil Dong' });

const pipe =
  (...fns) =>
  (value) => {
    let nextValue = value;
    while (fns.length > 0) {
      const fn = fns.shift();
      nextValue = fn(nextValue);
    }
    return nextValue;
  };

// 'HONG'
pipe(
  getPersonName,
  getUppercase,
  get4Characters,
  console.log
)({ name: 'Hong Gil Dong' });

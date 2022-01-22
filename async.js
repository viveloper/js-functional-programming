function add10(a) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + 10);
    }, 1000);
  });
}

add10(7)
  .then(res => res + 4)
  .then(console.log);

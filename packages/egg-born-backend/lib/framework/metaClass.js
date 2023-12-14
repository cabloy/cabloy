module.exports = function () {
  const classes = {};
  return new Proxy(classes, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      // only once
      if (!target[prop]) {
        target[prop] = value;
      }
    },
  });
};

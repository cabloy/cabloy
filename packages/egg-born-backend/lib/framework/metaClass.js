const ModelClass = require('../base/model.js');

module.exports = function () {
  const __classes = {};
  const classes = new Proxy(__classes, {
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

  // model
  classes.Model = ModelClass;

  return classes;
};

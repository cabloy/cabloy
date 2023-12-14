const ModelClass = require('../base/model.js');
const BeanModuleBaseClass = require('../module/bean/beanModuleBase.js');

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

  // BeanModuleBase
  classes.BeanModuleBase = BeanModuleBaseClass;

  return classes;
};

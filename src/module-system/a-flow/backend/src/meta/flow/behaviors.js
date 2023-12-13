const defaults = require('./defaults.js');

module.exports = app => {
  // const moduleInfo = module.info;
  const behaviors = {
    // base
    base: {
      title: 'Base',
      bean: 'base',
    },
  };

  for (const key in behaviors) {
    const behavior = behaviors[key];
    behavior.options = {};
    if (defaults[key]) {
      behavior.options.default = defaults[key];
    }
  }

  return behaviors;
};

const defaults = require('./defaults.js');

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

module.exports = behaviors;

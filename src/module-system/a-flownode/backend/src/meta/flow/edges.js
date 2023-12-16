const defaults = require('./defaults.js');

const moduleInfo = module.info;

const edges = {
  sequence: {
    title: 'Sequence',
    bean: 'sequence',
    validator: {
      module: moduleInfo.relativeName,
      validator: 'sequence',
    },
  },
};

for (const key in edges) {
  const node = edges[key];
  node.options = {};
  if (defaults[key]) {
    node.options.default = defaults[key];
  }
}

module.exports = edges;

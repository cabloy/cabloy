const versionManager = require('./bean/version.manager.js');
const sequenceSimple = require('./bean/sequence.simple.js');
const beanSequence = require('./bean/bean.sequence.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // sequence
  'sequence.simple': {
    mode: 'ctx',
    bean: sequenceSimple,
  },
  // global
  sequence: {
    mode: 'ctx',
    bean: beanSequence,
    global: true,
  },
};

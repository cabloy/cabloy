const versionManager = require('./bean/version.manager.js');
const sequenceSimple = require('./bean/sequence.simple.js');
const beanSequence = require('./bean/bean.sequence.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // sequence
  'sequence.simple': {
    bean: sequenceSimple,
  },
  // global
  sequence: {
    bean: beanSequence,
    global: true,
  },
};

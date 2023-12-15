const versionManager = require('./bean/version.manager.js');
const atomDict = require('./bean/atom.dict.js');
const beanDict = require('./bean/bean.dict.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // atom
  'atom.dict': {
    bean: atomDict,
  },
  // global
  dict: {
    mode: 'ctx',
    bean: beanDict,
    global: true,
  },
};

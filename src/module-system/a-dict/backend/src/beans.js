const versionManager = require('./bean/version.manager.js');
const atomDict = require('./bean/atom.dict.js');
const beanDict = require('./bean/bean.dict.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.dict': {
    bean: atomDict,
  },
  // global
  dict: {
    bean: beanDict,
    global: true,
  },
};

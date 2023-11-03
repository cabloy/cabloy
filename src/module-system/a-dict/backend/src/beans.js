const versionManager = require('./bean/version.manager.js');
const atomDict = require('./bean/atom.dict.js');
const beanDict = require('./bean/bean.dict.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.dict': {
      mode: 'ctx',
      bean: atomDict,
    },
    // global
    dict: {
      mode: 'ctx',
      bean: beanDict,
      global: true,
    },
  };
  return beans;
};

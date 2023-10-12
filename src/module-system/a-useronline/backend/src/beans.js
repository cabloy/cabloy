const versionManager = require('./bean/version.manager.js');
const atomUserOnline = require('./bean/atom.userOnline.js');
const atomUserOnlineHistory = require('./bean/atom.userOnlineHistory.js');
const beanUserOnline = require('./bean/bean.userOnline.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.userOnline': {
      mode: 'ctx',
      bean: atomUserOnline,
    },
    'atom.userOnlineHistory': {
      mode: 'ctx',
      bean: atomUserOnlineHistory,
    },
    // global
    userOnline: {
      mode: 'ctx',
      bean: beanUserOnline,
      global: true,
    },
  };
  return beans;
};

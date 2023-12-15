const versionManager = require('./bean/version.manager.js');
const atomUserOnline = require('./bean/atom.userOnline.js');
const atomUserOnlineHistory = require('./bean/atom.userOnlineHistory.js');
const beanUserOnline = require('./bean/bean.userOnline.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // atom
  'atom.userOnline': {
    bean: atomUserOnline,
  },
  'atom.userOnlineHistory': {
    bean: atomUserOnlineHistory,
  },
  // global
  userOnline: {
    mode: 'ctx',
    bean: beanUserOnline,
    global: true,
  },
};

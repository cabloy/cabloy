const versionManager = require('./bean/version.manager.js');
const beanIcon = require('./bean/bean.icon.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  icon: {
    bean: beanIcon,
    global: true,
  },
};

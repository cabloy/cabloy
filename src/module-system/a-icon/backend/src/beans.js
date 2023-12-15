const versionManager = require('./bean/version.manager.js');
const beanIcon = require('./bean/bean.icon.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  icon: {
    mode: 'ctx',
    bean: beanIcon,
    global: true,
  },
};

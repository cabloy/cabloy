const versionManager = require('./bean/version.manager.js');
const beanDetail = require('./bean/bean.detail.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  detail: {
    mode: 'ctx',
    bean: beanDetail,
    global: true,
  },
};

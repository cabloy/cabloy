const versionManager = require('./bean/version.manager.js');
const beanDetail = require('./bean/bean.detail.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  detail: {
    bean: beanDetail,
    global: true,
  },
};

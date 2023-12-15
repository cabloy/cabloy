const versionManager = require('./bean/version.manager.js');
const beanFile = require('./bean/bean.file.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // global
  file: {
    mode: 'ctx',
    bean: beanFile,
    global: true,
  },
};

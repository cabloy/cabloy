const versionManager = require('./bean/version.manager.js');

const beans = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
};
module.exports = beans;

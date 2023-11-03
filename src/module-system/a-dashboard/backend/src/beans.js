const versionManager = require('./bean/version.manager.js');
const atomDashboard = require('./bean/atom.dashboard.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.dashboard': {
      mode: 'ctx',
      bean: atomDashboard,
    },
  };
  return beans;
};

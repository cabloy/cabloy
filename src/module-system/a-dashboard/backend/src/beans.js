const versionManager = require('./bean/version.manager.js');
const atomDashboard = require('./bean/atom.dashboard.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.dashboard': {
    bean: atomDashboard,
  },
};

const versionManager = require('./bean/version.manager.js');
const atomLayout = require('./bean/atom.layout.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.layout': {
    bean: atomLayout,
  },
};

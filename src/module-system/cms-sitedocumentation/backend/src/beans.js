const versionManager = require('./bean/version.manager.js');
const atomDocument = require('./bean/atom.document.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // atom
  'atom.document': {
    bean: atomDocument,
  },
};

const versionManager = require('./bean/version.manager.js');
const atomNote = require('./bean/atom.note.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.note': {
      mode: 'app',
      bean: atomNote,
    },
  };
  return beans;
};

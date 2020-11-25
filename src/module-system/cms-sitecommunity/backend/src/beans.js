const versionManager = require('./bean/version.manager.js');
const atomPost = require('./bean/atom.post.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.post': {
      mode: 'app',
      bean: atomPost,
    },
  };
  return beans;
};

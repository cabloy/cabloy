const versionManager = require('./bean/version.manager.js');
const atomPost = require('./bean/atom.post.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.post': {
    bean: atomPost,
  },
};

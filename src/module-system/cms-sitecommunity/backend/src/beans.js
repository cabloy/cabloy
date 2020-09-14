const versionManager = require('./bean/version.manager.js');
const eventAtomClassValidator = require('./bean/event.atomClassValidator.js');
const atomPost = require('./bean/atom.post.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // event
    'event.atomClassValidator': {
      mode: 'ctx',
      bean: eventAtomClassValidator,
    },
    // atom
    'atom.post': {
      mode: 'app',
      bean: atomPost,
    },
  };
  return beans;
};

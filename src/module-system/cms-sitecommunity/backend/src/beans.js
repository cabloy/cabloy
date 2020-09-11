const versionManager = require('./bean/version.manager.js');
const eventAtomClassValidator = require('./bean/event.atomClassValidator.js');

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
  };
  return beans;
};

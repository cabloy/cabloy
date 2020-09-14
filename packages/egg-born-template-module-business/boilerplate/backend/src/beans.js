const versionManager = require('./bean/version.manager.js');
const atom{{atomClassNameCapitalize}} = require('./bean/atom.{{atomClassName}}.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.{{atomClassName}}': {
      mode: 'app',
      bean: atom{{atomClassNameCapitalize}},
    },
  };
  return beans;
};

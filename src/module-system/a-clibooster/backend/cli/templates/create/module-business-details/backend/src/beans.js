const versionManager = require('./bean/version.manager.js');
const atom{{atomClassNameCapitalize}} = require('./bean/atom.{{atomClassName}}.js');
const detail{{atomClassNameCapitalize}} = require('./bean/detail.{{atomClassName}}.js');

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
    // detail
    'detail.{{atomClassName}}': {
      mode: 'app',
      bean: detail{{atomClassNameCapitalize}},
    },
  };
  return beans;
};

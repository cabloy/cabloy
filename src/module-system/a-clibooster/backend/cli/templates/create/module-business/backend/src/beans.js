const versionManager = require('./bean/version.manager.js');
const atom<%=argv.atomClassNameCapitalize%> = require('./bean/atom.<%=argv.atomClassName%>.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.<%=argv.atomClassName%>': {
      mode: 'ctx',
      bean: atom<%=argv.atomClassNameCapitalize%>,
    },
  };
  return beans;
};

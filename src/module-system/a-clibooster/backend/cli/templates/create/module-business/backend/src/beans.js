const versionManager = require('./bean/version.manager.js');
const atom<%=argv.atomClassNameCapitalize%> = require('./bean/atom.<%=argv.atomClassName%>.js');

module.exports = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.<%=argv.atomClassName%>': {
      bean: atom<%=argv.atomClassNameCapitalize%>,
    },
  };

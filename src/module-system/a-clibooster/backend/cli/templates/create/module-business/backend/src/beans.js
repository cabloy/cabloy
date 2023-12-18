const versionManager = require('./bean/version.manager.js');
const atom<%=argv.atomClassNameCapitalize%> = require('./bean/atom.<%=argv.atomClassName%>.js');

const beans = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // atom
  'atom.<%=argv.atomClassName%>': {
    bean: atom<%=argv.atomClassNameCapitalize%>,
  },
};
module.exports = beans;

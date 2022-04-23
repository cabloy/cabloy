const versionManager = require('./bean/version.manager.js');
const cliDefaultDemo = require('./bean/cli.default.demo.js');
const cliTokenAdd = require('./bean/cli.token.add.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // cli
    'cli.default.demo': {
      mode: 'ctx',
      bean: cliDefaultDemo,
    },
    'cli.token.add': {
      mode: 'ctx',
      bean: cliTokenAdd,
    },
  };
  return beans;
};

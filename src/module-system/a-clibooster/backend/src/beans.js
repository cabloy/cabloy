const versionManager = require('./bean/version.manager.js');
const cliDemo = require('./bean/cli.demo.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // cli
    'cli.demo': {
      mode: 'ctx',
      bean: cliDemo,
    },
  };
  return beans;
};

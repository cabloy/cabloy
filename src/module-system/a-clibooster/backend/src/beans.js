const versionManager = require('./bean/version.manager.js');
const cliDefaultDemo = require('./bean/cli.default.demo.js');

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
  };
  return beans;
};

const versionManager = require('./bean/version.manager.js');
const beanCliBase = require('./bean/bean.cliBase.js');
const beanCli = require('./bean/bean.cli.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    cliBase: {
      mode: 'app',
      bean: beanCliBase,
      global: true,
    },
    cli: {
      mode: 'ctx',
      bean: beanCli,
      global: true,
    },
  };
  return beans;
};

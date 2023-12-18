const versionManager = require('./bean/version.manager.js');
const localConsole = require('./bean/local.console.js');
const localHelper = require('./bean/local.helper.js');
const localTemplate = require('./bean/local.template.js');
const beanCliBase = require('./bean/bean.cliBase.js');
const beanCli = require('./bean/bean.cli.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // local
  'local.helper': {
    bean: localHelper,
  },
  'local.template': {
    bean: localTemplate,
  },
  'local.console': {
    bean: localConsole,
  },
  // global
  cliBase: {
    bean: beanCliBase,
    global: true,
  },
  cli: {
    bean: beanCli,
    global: true,
  },
};

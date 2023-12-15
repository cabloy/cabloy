const versionManager = require('./bean/version.manager.js');
const localConsole = require('./bean/local.console.js');
const localHelper = require('./bean/local.helper.js');
const localTemplate = require('./bean/local.template.js');
const beanCliBase = require('./bean/bean.cliBase.js');
const beanCli = require('./bean/bean.cli.js');

module.exports = {
  // version
  'version.manager': {
    mode: 'app',
    bean: versionManager,
  },
  // local
  'local.helper': {
    mode: 'ctx',
    bean: localHelper,
  },
  'local.template': {
    mode: 'ctx',
    bean: localTemplate,
  },
  'local.console': {
    mode: 'ctx',
    bean: localConsole,
  },
  // global
  cliBase: {
    bean: beanCliBase,
    global: true,
  },
  cli: {
    mode: 'ctx',
    bean: beanCli,
    global: true,
  },
};

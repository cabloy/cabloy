const versionManager = require('./bean/version.manager.js');
const cliDefaultList = require('./bean/cli.default.list.js');
const cliTokenAdd = require('./bean/cli.token.add.js');
const cliTokenDelete = require('./bean/cli.token.delete.js');
const cliTokenList = require('./bean/cli.token.list.js');
const cliToolsBabel = require('./bean/cli.tools.babel.js');
const cliToolsIcons = require('./bean/cli.tools.icons.js');
const cliCreateSuite = require('./bean/cli.create.suite.js');
const cliCreateModule = require('./bean/cli.create.module.js');
const cliCreateApp = require('./bean/cli.create.app.js');
const cliCreateAtom = require('./bean/cli.create.atom.js');
const cliCreateController = require('./bean/cli.create.controller.js');
const cliCreatePage = require('./bean/cli.create.page.js');
const cliCreatePagex = require('./bean/cli.create.pagex.js');
const cliStoreSync = require('./bean/cli.store.sync.js');
const cliStorePublish = require('./bean/cli.store.publish.js');
const cliGitCommit = require('./bean/cli.git.commit.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // cli
    'cli.default.list': {
      mode: 'ctx',
      bean: cliDefaultList,
    },
    'cli.token.add': {
      mode: 'ctx',
      bean: cliTokenAdd,
    },
    'cli.token.delete': {
      mode: 'ctx',
      bean: cliTokenDelete,
    },
    'cli.token.list': {
      mode: 'ctx',
      bean: cliTokenList,
    },
    'cli.tools.babel': {
      mode: 'ctx',
      bean: cliToolsBabel,
    },
    'cli.tools.icons': {
      mode: 'ctx',
      bean: cliToolsIcons,
    },
    'cli.create.suite': {
      mode: 'ctx',
      bean: cliCreateSuite,
    },
    'cli.create.module': {
      mode: 'ctx',
      bean: cliCreateModule,
    },
    'cli.create.app': {
      mode: 'ctx',
      bean: cliCreateApp,
    },
    'cli.create.atom': {
      mode: 'ctx',
      bean: cliCreateAtom,
    },
    'cli.create.controller': {
      mode: 'ctx',
      bean: cliCreateController,
    },
    'cli.create.page': {
      mode: 'ctx',
      bean: cliCreatePage,
    },
    'cli.create.pagex': {
      mode: 'ctx',
      bean: cliCreatePagex,
    },
    'cli.store.sync': {
      mode: 'ctx',
      bean: cliStoreSync,
    },
    'cli.store.publish': {
      mode: 'ctx',
      bean: cliStorePublish,
    },
    'cli.git.commit': {
      mode: 'ctx',
      bean: cliGitCommit,
    },
  };
  return beans;
};

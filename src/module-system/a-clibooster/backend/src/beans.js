const versionManager = require('./bean/version.manager.js');
const cliDefaultList = require('./bean/cli.default.list.js');
const cliTokenAdd = require('./bean/cli.token.add.js');
const cliTokenDelete = require('./bean/cli.token.delete.js');
const cliTokenList = require('./bean/cli.token.list.js');
const cliToolsBabel = require('./bean/cli.tools.babel.js');
const cliToolsIcons = require('./bean/cli.tools.icons.js');
const cliToolsDemo = require('./bean/cli.tools.demo.js');
const cliCreateSuite = require('./bean/cli.create.suite.js');
const cliCreateModule = require('./bean/cli.create.module.js');
const cliCreateApp = require('./bean/cli.create.app.js');
const cliCreateAtom = require('./bean/cli.create.atom.js');
const cliCreateItemOnly = require('./bean/cli.create.itemOnly.js');
const cliCreateDetail = require('./bean/cli.create.detail.js');
const cliCreateAtomAction = require('./bean/cli.create.atomAction.js');
const cliCreateController = require('./bean/cli.create.controller.js');
const cliCreatePage = require('./bean/cli.create.page.js');
const cliCreatePagex = require('./bean/cli.create.pagex.js');
const cliFrontRenderTableCell = require('./bean/cli.front.renderTableCell.js');
const cliStoreSync = require('./bean/cli.store.sync.js');
const cliStorePublish = require('./bean/cli.store.publish.js');
const cliGitCommit = require('./bean/cli.git.commit.js');
const localUtils = require('./bean/local.utils.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // cli
    'cli.default.list': {
      bean: cliDefaultList,
    },
    'cli.token.add': {
      bean: cliTokenAdd,
    },
    'cli.token.delete': {
      bean: cliTokenDelete,
    },
    'cli.token.list': {
      bean: cliTokenList,
    },
    'cli.tools.babel': {
      bean: cliToolsBabel,
    },
    'cli.tools.icons': {
      bean: cliToolsIcons,
    },
    'cli.tools.demo': {
      bean: cliToolsDemo,
    },
    'cli.create.suite': {
      bean: cliCreateSuite,
    },
    'cli.create.module': {
      bean: cliCreateModule,
    },
    'cli.create.app': {
      bean: cliCreateApp,
    },
    'cli.create.atom': {
      bean: cliCreateAtom,
    },
    'cli.create.itemOnly': {
      bean: cliCreateItemOnly,
    },
    'cli.create.detail': {
      bean: cliCreateDetail,
    },
    'cli.create.atomAction': {
      bean: cliCreateAtomAction,
    },
    'cli.create.controller': {
      bean: cliCreateController,
    },
    'cli.create.page': {
      bean: cliCreatePage,
    },
    'cli.create.pagex': {
      bean: cliCreatePagex,
    },
    'cli.front.renderTableCell': {
      bean: cliFrontRenderTableCell,
    },
    'cli.store.sync': {
      bean: cliStoreSync,
    },
    'cli.store.publish': {
      bean: cliStorePublish,
    },
    'cli.git.commit': {
      bean: cliGitCommit,
    },
    // local
    'local.utils': {
      mode: 'ctx',
      bean: localUtils,
    },
  };
  return beans;
};

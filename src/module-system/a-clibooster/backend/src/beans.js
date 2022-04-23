const versionManager = require('./bean/version.manager.js');
const cliDefaultDemo = require('./bean/cli.default.demo.js');
const cliTokenAdd = require('./bean/cli.token.add.js');
const cliTokenDelete = require('./bean/cli.token.delete.js');
const cliTokenList = require('./bean/cli.token.list.js');
const cliToolsBabel = require('./bean/cli.tools.babel.js');
const cliToolsIcons = require('./bean/cli.tools.icons.js');

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
  };
  return beans;
};

const defaultList = require('./command/default.list.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');
const tokenList = require('./command/token.list.js');
const toolsBabel = require('./command/tools.babel.js');
const toolsIcons = require('./command/tools.icons.js');
const createSuite = require('./command/create.suite.js');
const createModule = require('./command/create.module.js');
const createApp = require('./command/create.app.js');
const createAtom = require('./command/create.atom.js');
const createController = require('./command/create.controller.js');
const createPage = require('./command/create.page.js');
const createPagex = require('./command/create.pagex.js');
const renderTableCell = require('./command/front.renderTableCell.js');
const storeSync = require('./command/store.sync.js');
const storePublish = require('./command/store.publish.js');
const gitCommit = require('./command/git.commit.js');

module.exports = app => {
  const commands = {
    default: {
      list: defaultList(app),
    },
    token: {
      add: tokenAdd(app),
      delete: tokenDelete(app),
      list: tokenList(app),
    },
    tools: {
      babel: toolsBabel(app),
      icons: toolsIcons(app),
    },
    create: {
      suite: createSuite(app),
      module: createModule(app),
      app: createApp(app),
      atom: createAtom(app),
      controller: createController(app),
      page: createPage(app),
      pagex: createPagex(app),
    },
    front: {
      renderTableCell: renderTableCell(app),
    },
    store: {
      sync: storeSync(app),
      publish: storePublish(app),
    },
    git: {
      commit: gitCommit(app),
    },
  };
  return commands;
};

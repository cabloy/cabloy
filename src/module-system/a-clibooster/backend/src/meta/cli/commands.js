const defaultList = require('./command/default.list.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');
const tokenList = require('./command/token.list.js');
const toolsBabel = require('./command/tools.babel.js');
const toolsIcons = require('./command/tools.icons.js');
const toolsDemo = require('./command/tools.demo.js');
const createSuite = require('./command/create.suite.js');
const createModule = require('./command/create.module.js');
const createApp = require('./command/create.app.js');
const createAtom = require('./command/create.atom.js');
const createItemOnly = require('./command/create.itemOnly.js');
const createDetail = require('./command/create.detail.js');
const createController = require('./command/create.controller.js');
const createPage = require('./command/create.page.js');
const createPagex = require('./command/create.pagex.js');
const renderTableCell = require('./command/front.renderTableCell.js');
const storeSync = require('./command/store.sync.js');
const storePublish = require('./command/store.publish.js');
const gitCommit = require('./command/git.commit.js');

const commands = {
  default: {
    list: defaultList,
  },
  token: {
    add: tokenAdd,
    delete: tokenDelete,
    list: tokenList,
  },
  tools: {
    babel: toolsBabel,
    icons: toolsIcons,
    demo: toolsDemo,
  },
  create: {
    suite: createSuite,
    module: createModule,
    app: createApp,
    atom: createAtom,
    itemOnly: createItemOnly,
    detail: createDetail,
    controller: createController,
    page: createPage,
    pagex: createPagex,
  },
  front: {
    renderTableCell,
  },
  store: {
    sync: storeSync,
    publish: storePublish,
  },
  git: {
    commit: gitCommit,
  },
};
module.exports = commands;

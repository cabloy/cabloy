const defaultDemo = require('./command/default.demo.js');
const defaultList = require('./command/default.list.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');
const tokenList = require('./command/token.list.js');
const toolsBabel = require('./command/tools.babel.js');
const toolsIcons = require('./command/tools.icons.js');
const createSuite = require('./command/create.suite.js');
const createModule = require('./command/create.module.js');
const createAtom = require('./command/create.atom.js');
const createController = require('./command/create.controller.js');
const storeSync = require('./command/store.sync.js');
const storePublish = require('./command/store.publish.js');

module.exports = app => {
  const commands = {
    default: {
      demo: defaultDemo(app),
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
      atom: createAtom(app),
      controller: createController(app),
    },
    store: {
      sync: storeSync(app),
      publish: storePublish(app),
    },
  };
  return commands;
};

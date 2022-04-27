const defaultDemo = require('./command/default.demo.js');
const defaultList = require('./command/default.list.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');
const tokenList = require('./command/token.list.js');
const toolsBabel = require('./command/tools.babel.js');
const toolsIcons = require('./command/tools.icons.js');
const createModule = require('./command/create.module.js');
const createAtom = require('./command/create.atom.js');
const createController = require('./command/create.controller.js');

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
      module: createModule(app),
      atom: createAtom(app),
      controller: createController(app),
    },
  };
  return commands;
};

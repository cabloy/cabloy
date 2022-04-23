const defaultDemo = require('./command/default.demo.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');
const tokenList = require('./command/token.list.js');
const toolsBabel = require('./command/tools.babel.js');
const toolsIcons = require('./command/tools.icons.js');

module.exports = app => {
  const commands = {
    default: {
      demo: defaultDemo(app),
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
  };
  return commands;
};

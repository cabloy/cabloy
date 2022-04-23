const defaultDemo = require('./command/default.demo.js');
const tokenAdd = require('./command/token.add.js');
const tokenDelete = require('./command/token.delete.js');

module.exports = app => {
  const commands = {
    default: {
      demo: defaultDemo(app),
    },
    token: {
      add: tokenAdd(app),
      delete: tokenDelete(app),
    },
  };
  return commands;
};

const defaultDemo = require('./command/default.demo.js');
const tokenAdd = require('./command/token.add.js');

module.exports = app => {
  const commands = {
    default: {
      demo: defaultDemo(app),
    },
    token: {
      add: tokenAdd(app),
    },
  };
  return commands;
};

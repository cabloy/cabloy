const defaultDemo = require('./command/default.demo.js');

module.exports = app => {
  const commands = {
    default: {
      demo: defaultDemo(app),
    },
  };
  return commands;
};

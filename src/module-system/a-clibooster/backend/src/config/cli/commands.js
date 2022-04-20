const demo = require('./command/demo.js');

module.exports = app => {
  const commands = {
    demo: demo(app),
  };
  return commands;
};

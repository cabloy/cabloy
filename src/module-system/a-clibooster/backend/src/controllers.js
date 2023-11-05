const tools = require('./controller/tools.js');

module.exports = app => {
  const controllers = {
    tools,
  };
  return controllers;
};

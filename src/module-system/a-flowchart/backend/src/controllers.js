const flowDef = require('./controller/flowDef.js');

module.exports = app => {
  const controllers = {
    flowDef,
  };
  return controllers;
};

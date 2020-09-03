const hook = require('./controller/hook.js');

module.exports = app => {
  const controllers = {
    hook,
  };
  return controllers;
};

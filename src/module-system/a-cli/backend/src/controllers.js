const cli = require('./controller/cli.js');

module.exports = app => {
  const controllers = {
    cli,
  };
  return controllers;
};

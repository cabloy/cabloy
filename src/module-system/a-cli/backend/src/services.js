const cli = require('./service/cli.js');

module.exports = app => {
  const services = {
    cli,
  };
  return services;
};

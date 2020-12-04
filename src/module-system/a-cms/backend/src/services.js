const render = require('./service/render.js');
const site = require('./service/site.js');

module.exports = app => {
  const services = {
    render,
    site,
  };
  return services;
};

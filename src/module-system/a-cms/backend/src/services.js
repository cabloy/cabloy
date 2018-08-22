const version = require('./service/version.js');
const article = require('./service/article.js');
const render = require('./service/render.js');
const site = require('./service/site.js');

module.exports = app => {
  const services = {
    version,
    article,
    render,
    site,
  };
  return services;
};

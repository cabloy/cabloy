const version = require('./service/version.js');
const article = require('./service/article.js');
const category = require('./service/category.js');
const render = require('./service/render.js');
const site = require('./service/site.js');

module.exports = app => {
  const services = {
    version,
    article,
    category,
    render,
    site,
  };
  return services;
};

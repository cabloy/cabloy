const version = require('./service/version.js');
const article = require('./service/article.js');
const category = require('./service/category.js');
const render = require('./service/render.js');
const site = require('./service/site.js');
const tag = require('./service/tag.js');
const event = require('./service/event.js');

module.exports = app => {
  const services = {
    version,
    article,
    category,
    render,
    site,
    tag,
    event,
  };
  return services;
};

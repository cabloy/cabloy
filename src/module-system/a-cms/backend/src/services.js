const category = require('./service/category.js');
const render = require('./service/render.js');
const site = require('./service/site.js');
const tag = require('./service/tag.js');

module.exports = app => {
  const services = {
    category,
    render,
    site,
    tag,
  };
  return services;
};

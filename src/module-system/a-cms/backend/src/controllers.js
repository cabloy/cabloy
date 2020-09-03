const version = require('./controller/version.js');
const article = require('./controller/article.js');
const category = require('./controller/category.js');
const render = require('./controller/render.js');
const site = require('./controller/site.js');
const tag = require('./controller/tag.js');
const comment = require('./controller/comment.js');
const rss = require('./controller/rss.js');
const queue = require('./controller/queue.js');

module.exports = app => {
  const controllers = {
    version,
    article,
    category,
    render,
    site,
    tag,
    comment,
    rss,
    queue,
  };
  return controllers;
};

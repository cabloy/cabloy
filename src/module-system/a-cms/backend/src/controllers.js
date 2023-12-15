const article = require('./controller/article.js');
const render = require('./controller/render.js');
const site = require('./controller/site.js');
const comment = require('./controller/comment.js');
const rss = require('./controller/rss.js');

module.exports = {
  article,
  render,
  site,
  comment,
  rss,
};

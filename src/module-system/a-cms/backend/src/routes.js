const version = require('./controller/version.js');
const article = require('./controller/article.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // article
    { method: 'post', path: 'article/create', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/read', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/select', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/write', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/delete', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/action', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/enable', controller: article, middlewares: 'inner' },
  ];
  return routes;
};

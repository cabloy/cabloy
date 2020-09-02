const version = require('./controller/version.js');
const post = require('./controller/post.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // post
    { method: 'post', path: 'post/create', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/read', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/select', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/write', controller: post, middlewares: 'inner', meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'post/delete', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/action', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/enable', controller: post, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};

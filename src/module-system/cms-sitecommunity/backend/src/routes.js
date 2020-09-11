module.exports = app => {
  const routes = [
    // post
    { method: 'post', path: 'post/create', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/read', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/select', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/write', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'post/delete', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/action', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'post/enable', controller: 'post', middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // util
    { method: 'post', path: 'util/submit', controller: 'util', middlewares: 'inner' },
    { method: 'post', path: 'util/queueSubmit', controller: 'util', middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};

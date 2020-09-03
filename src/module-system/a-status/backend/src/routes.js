module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'status/set', controller: 'status', middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};

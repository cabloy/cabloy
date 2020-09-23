module.exports = app => {
  let routes = [
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      // flow/start
      { method: 'post', path: 'flow/start', controller: 'flow', middlewares: 'test', meta: { auth: { enable: false } } },
    ]);
  }
  return routes;
};

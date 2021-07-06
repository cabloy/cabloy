module.exports = app => {
  let routes = [];
  routes = routes.concat([
    // flow/start
    { method: 'post', path: 'flow/start', controller: 'flow', middlewares: 'test' },
  ]);
  return routes;
};

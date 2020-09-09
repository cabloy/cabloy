module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
  ];
  return routes;
};
